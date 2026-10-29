import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/api', () => ({ apiFetch: vi.fn() }));

function makeResponse(body: unknown, ok = true): Response {
  return { ok, json: async () => body } as Response;
}

describe('auth_account_registration API contract safety', () => {
  let api: typeof import('@/app/public_auth/auth_account_registration/api/PublicAuthRegistrationApi');
  let apiFetch: typeof import('@/lib/api')['apiFetch'];

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('NEXT_PUBLIC_AUTH_SIGNUP_PATH', '/api/auth/signup');
    const transport = await import('@/lib/api');
    apiFetch = vi.mocked(transport.apiFetch);
    vi.mocked(apiFetch).mockReset();
    api = await import('@/app/public_auth/auth_account_registration/api/PublicAuthRegistrationApi');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('preserves the configured endpoint, POST JSON payload, and idempotency header', async () => {
    const payload = { ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' } as const;
    vi.mocked(apiFetch).mockResolvedValueOnce(makeResponse({ success: true, message: 'Accepted', data: null }));

    const result = await api.createPublicAuthRegistration(payload, 'synthetic-idempotency-key');

    expect(result).toMatchObject({ success: true, message: 'Accepted', data: null });
    expect(apiFetch).toHaveBeenCalledWith('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'synthetic-idempotency-key' },
    });
  });

  it('fails closed before transport when the idempotency key is blank', async () => {
    await expect(api.createPublicAuthRegistration({ ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' } as const, '   ')).rejects.toMatchObject({ code: 'UNEXPECTED_RESPONSE' });
    expect(apiFetch).not.toHaveBeenCalled();
  });

  it('rejects malformed response envelopes instead of trusting a cast', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce(makeResponse({ success: 'yes', message: 'bad', data: null }));

    await expect(api.createPublicAuthRegistration({ ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' } as const, 'synthetic-idempotency-key')).rejects.toMatchObject({ code: 'UNEXPECTED_RESPONSE' });
  });

  it('preserves field identifiers on a rejected response but maps user-facing copy safely', async () => {
    vi.mocked(apiFetch).mockResolvedValueOnce(makeResponse({
      success: false,
      message: 'Untrusted server detail must not be rendered',
      data: null,
      validationErrors: [{ field: 'email', message: 'Invalid' }],
    }, false));

    let caught: unknown;
    try {
      await api.createPublicAuthRegistration({ ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' } as const, 'synthetic-idempotency-key');
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(api.PublicAuthRegistrationApiError);
    expect(caught).toMatchObject({ code: 'REQUEST_REJECTED', validationErrors: [{ field: 'email', message: 'Invalid' }] });
    expect(api.getPublicAuthRegistrationApiErrorMessage(caught, { configuration: 'Configuration', connection: 'Connection', requestFailed: 'Request failed', unexpected: 'Unexpected' })).toBe('Request failed');
    expect(api.getPublicAuthRegistrationApiErrorMessage(caught, { configuration: 'Configuration', connection: 'Connection', requestFailed: 'Request failed', unexpected: 'Unexpected' })).not.toContain('Untrusted server detail');
  });

  it('classifies a transport rejection as a connection failure', async () => {
    vi.mocked(apiFetch).mockRejectedValueOnce(new Error('private network detail'));

    await expect(api.createPublicAuthRegistration({ ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' } as const, 'synthetic-idempotency-key')).rejects.toMatchObject({ code: 'CONNECTION' });
  });
});
