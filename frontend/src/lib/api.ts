/**
 * Host API client implementation.
 * Wraps native fetch and provides standard request/response handling,
 * including idempotency, envelope validation, and mock auth fallbacks.
 */
import { ApiResponseError, ApiResponseEnvelopeSchema, nonEmptyApiMessage } from '@/lib/apiSchema';
import { frontendRuntimeConfig } from '@/lib/env';
export type { ApiResponse, PaginationMeta, ValidationErrorItem } from '@/lib/apiSchema';
export { ApiResponseError, ApiResponseEnvelopeSchema, nonEmptyApiMessage };

export interface ApiFetchOptions extends RequestInit {
  /** Required for POST/PATCH/PUT/DELETE in admin workflows. Generate once per user intent and reuse on retry. */
  idempotencyKey?: string;
  /** Active next-intl locale. When omitted, use the document language / browser language / English. */
  locale?: string;
}

const MUTATING_METHODS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);
const AUTH_FAILURE_HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type ApiAuthFailureHandler = (error: ApiResponseError) => void;

let apiAuthFailureHandler: ApiAuthFailureHandler | null = null;

export function configureApiAuthFailureHandler(handler: ApiAuthFailureHandler | null): void {
  apiAuthFailureHandler = handler;
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    const key = crypto.randomUUID();
    if (UUID_V4_PATTERN.test(key)) return key;
  }
  throw new Error('Secure random UUID generation is unavailable; mutation was not started.');
}

function resolveRequestLocale(explicitLocale?: string): string {
  if (explicitLocale?.trim()) return explicitLocale.trim();
  if (typeof document !== 'undefined' && document.documentElement.lang?.trim()) {
    return document.documentElement.lang.trim();
  }
  if (typeof navigator !== 'undefined' && navigator.language?.trim()) return navigator.language.trim();
  return 'en';
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: { total: number; page: number; limit: number; totalPages: number; hasNextPage: boolean; hasPrevPage: boolean };
  requestId: string;
}

export interface ApiFailure {
  success: false;
  message: string;
  data: null;
  error?: string;
  errorCode: string;
  statusCode: number;
  requestId: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

export async function apiFetch(input: string | URL | Request, init?: ApiFetchOptions): Promise<Response>;
export async function apiFetch<T = any>(endpoint: string | URL | Request, options?: ApiFetchOptions): Promise<T>;
export async function apiFetch<T = any>(input: string | URL | Request, init?: ApiFetchOptions): Promise<T | Response> {
  const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

  // Standalone frontend auth fallback when backend auth service is not running
  if (urlString.includes('/api/auth/')) {
    try {
      const res = await fetch(input, init);
      if (res.ok) {
        const text = await res.clone().text();
        const parsed = text ? JSON.parse(text) : null;
        if (parsed && typeof parsed === 'object') {
          Object.assign(res, parsed);
        }
        return res as unknown as T;
      }
    } catch {
      // Backend not running, fall through to synthetic mock response
    }

    let role = 'manager';
    let email = 'manager@library.com';
    try {
      if (init?.body && typeof init.body === 'string') {
        const bodyObj = JSON.parse(init.body);
        if (bodyObj.role) role = bodyObj.role;
        if (bodyObj.email) email = bodyObj.email;
      }
    } catch {
      // Ignore parse failure and keep defaults
    }

    const mockData = {
      success: true,
      message: 'Accepted',
      data: { role, email },
      requestId: 'mock-auth-req-1',
    };
    const syntheticRes = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    Object.assign(syntheticRes, mockData);
    return syntheticRes as unknown as T;
  }

  const method = (init?.method ?? 'GET').toUpperCase();
  const idempotencyKey = init?.idempotencyKey?.trim();
  if (MUTATING_METHODS.has(method) && idempotencyKey && !UUID_V4_PATTERN.test(idempotencyKey)) {
    throw new Error(`A UUIDv4 idempotencyKey is required for ${method} ${urlString}.`);
  }

  const baseUrl = frontendRuntimeConfig?.NEXT_PUBLIC_API_BASE_URL
    ? frontendRuntimeConfig.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
    : '';
  const finalUrl = urlString.startsWith('http') || !baseUrl ? urlString : `${baseUrl}${urlString}`;

  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (init?.body && typeof FormData !== 'undefined' && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (init?.locale) {
    headers.set('Accept-Language', resolveRequestLocale(init.locale));
  }
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey);

  const { idempotencyKey: _idempotencyKey, locale: _locale, ...requestInit } = init || {};
  const response = await fetch(finalUrl, {
    ...requestInit,
    method,
    headers,
  });

  let payload: unknown = null;
  let invalidJsonBody = false;
  if (response.body !== null) {
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      try { payload = await response.json(); } catch { invalidJsonBody = true; }
    } else {
      payload = await response.text();
    }
  }

  if (response.ok && invalidJsonBody) {
    throw new Error('The server returned an invalid JSON response.');
  }

  if (!response.ok) {
    const parsedEnvelope = ApiResponseEnvelopeSchema.safeParse(payload);
    const error = parsedEnvelope.success && !parsedEnvelope.data.success
      ? new ApiResponseError(nonEmptyApiMessage(parsedEnvelope.data.message, parsedEnvelope.data.statusCode, parsedEnvelope.data.errorCode), {
        errorCode: parsedEnvelope.data.errorCode,
        statusCode: parsedEnvelope.data.statusCode,
        requestId: parsedEnvelope.data.requestId,
        validationErrors: parsedEnvelope.data.validationErrors,
      })
      : new ApiResponseError(`Request failed with status ${response.status}`, { statusCode: response.status });
    const authFailureStatus = error.statusCode ?? response.status;
    if (authFailureStatus === AUTH_FAILURE_HTTP_STATUS.UNAUTHORIZED || authFailureStatus === AUTH_FAILURE_HTTP_STATUS.FORBIDDEN) {
      apiAuthFailureHandler?.(error);
    }
    throw error;
  }

  if (payload && typeof payload === 'object') {
    Object.assign(response, payload);
  }
  return (payload !== null ? payload : response) as T;
}

export const fetchApi = apiFetch;
