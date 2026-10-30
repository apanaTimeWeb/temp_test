import { ApiResponseError, ApiResponseEnvelopeSchema, nonEmptyApiMessage } from '@/lib/apiSchema';
import { frontendRuntimeConfig } from '@/lib/env';
export type { ApiResponse, PaginationMeta, ValidationErrorItem } from '@/lib/apiSchema';

/** Global frontend HTTP transport. Feature modules must use this wrapper. */
export interface ApiFetchOptions extends RequestInit {
  /** Required for POST/PATCH/PUT/DELETE. Generate once per user intent and reuse on retry. */
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

/** Register the host-owned redirect/session-expiry handler without coupling feature code to routing. */
export function configureApiAuthFailureHandler(handler: ApiAuthFailureHandler | null): void {
  apiAuthFailureHandler = handler;
}

/** Create one key per user intent, not once per transport retry. */
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

export async function apiFetch<TResponse = unknown>(path: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const method = (options.method ?? 'GET').toUpperCase();
  const idempotencyKey = options.idempotencyKey?.trim();
  if (MUTATING_METHODS.has(method) && (!idempotencyKey || !UUID_V4_PATTERN.test(idempotencyKey))) {
    throw new Error(`A UUIDv4 idempotencyKey is required for ${method} ${path}.`);
  }

  const baseUrl = frontendRuntimeConfig.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  const url = `${baseUrl}${path}`;
  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (options.body && typeof FormData !== 'undefined' && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept-Language', resolveRequestLocale(options.locale));
  if (idempotencyKey) headers.set('Idempotency-Key', idempotencyKey);

  const { idempotencyKey: _idempotencyKey, locale: _locale, ...requestInit } = options;
  const response = await fetch(url, {
    ...requestInit,
    method,
    credentials: options.credentials ?? 'include',
    headers,
    cache: options.cache ?? 'no-store',
  });

  let payload: unknown = null;
  let invalidJsonBody = false;
  // Fetch exposes a null body for responses whose HTTP semantics prohibit a body.
  // Checking the response body avoids coupling transport parsing to a magic status code.
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
  return payload as TResponse;
}

/** Transitional alias retained for the host application while feature APIs use apiFetch. */
export const fetchApi = apiFetch;
