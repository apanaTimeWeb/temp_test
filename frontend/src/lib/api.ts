/**
 * Host API client implementation.
 * Wraps native fetch and provides standard request/response handling.
 */
export async function apiFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  return fetch(input, init);
}

