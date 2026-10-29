/**
 * Host API client implementation.
 * Wraps native fetch and provides standard request/response handling.
 */

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

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export async function apiFetch(input: string | URL | Request, init?: RequestInit): Promise<Response>;
export async function apiFetch<T = any>(endpoint: string | URL | Request, options?: RequestInit): Promise<ApiResponse<T>>;
export async function apiFetch<T = any>(input: string | URL | Request, init?: RequestInit): Promise<ApiResponse<T> | Response> {
  const res = await fetch(input, init);
  try {
    const text = await res.clone().text();
    const parsed = text ? JSON.parse(text) : null;
    if (parsed && typeof parsed === 'object') {
      Object.assign(res, parsed);
    }
  } catch {
    // Non-JSON response, ignore
  }
  return res as unknown as ApiResponse<T>;
}
