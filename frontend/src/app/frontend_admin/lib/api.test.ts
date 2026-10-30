import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, configureApiAuthFailureHandler } from '@/app/frontend_admin/lib/api';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  configureApiAuthFailureHandler(null);
});

describe('global apiFetch transport', () => {
  it('returns null for a successful response with no body', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/health')).resolves.toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('rejects mutation requests without an idempotency key before making a network request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/api/v1/example', { method: 'POST', body: JSON.stringify({ value: 1 }) }))
      .rejects.toThrow('A UUIDv4 idempotencyKey is required for POST /api/v1/example.');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('parses JSON response bodies from the transport', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch<{ ok: boolean }>('/health')).resolves.toEqual({ ok: true });
  });

  it('forwards locale and idempotency metadata with safe default transport options', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ saved: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch<{ saved: boolean }>('/api/v1/example', {
      method: 'POST',
      body: JSON.stringify({ value: 1 }),
      idempotencyKey: '550e8400-e29b-41d4-a716-446655440000',
      locale: 'hi',
    })).resolves.toEqual({ saved: true });

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(request.headers);
    expect(headers.get('Accept')).toBe('application/json');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Accept-Language')).toBe('hi');
    expect(headers.get('Idempotency-Key')).toBe('550e8400-e29b-41d4-a716-446655440000');
    expect(request.credentials).toBe('include');
    expect(request.cache).toBe('no-store');
  });
});


describe('malformed HTTP error envelopes', () => {
  it.each([
    ['', 422], ['   ', 422], [null, 422], [undefined, 422], [17, 422],
  ])('uses a non-empty status fallback for message %s', async (message, status) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message }), {
      status, headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(apiFetch('/broken')).rejects.toThrow(`Request failed with status ${status}`);
  });

  it('uses a status fallback for a malformed JSON error response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{bad json', {
      status: 502, headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(apiFetch('/broken')).rejects.toThrow('Request failed with status 502');
  });

  it('preserves canonical error metadata and notifies the host on authorization failures', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      success: false,
      message: 'Session expired',
      data: null,
      errorCode: 'AUTH_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'req-auth-1',
    }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    }));
    const authHandler = vi.fn();
    configureApiAuthFailureHandler(authHandler);
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiFetch('/private')).rejects.toMatchObject({
      message: 'Session expired',
      errorCode: 'AUTH_UNAUTHORIZED',
      statusCode: 401,
      requestId: 'req-auth-1',
    });
    expect(authHandler).toHaveBeenCalledOnce();
  });
});
