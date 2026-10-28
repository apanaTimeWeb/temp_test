import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicAuthPasswordRecoveryPage from '@/app/frontend_public/public_auth/auth_password_recovery/components/PublicAuthPasswordRecoveryPage';
import { requirePublicAuthPasswordRecoveryEndpointPath } from '@/app/frontend_public/public_auth/auth_password_recovery/utils/PublicAuthPasswordRecoveryUrlGuard';

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn(), getKey: vi.fn(async () => 'synthetic-idempotency-key'), clearKey: vi.fn() }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('../hooks/usePublicAuthPasswordRecoveryMutation', () => ({ usePublicAuthPasswordRecoveryMutation: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }) }));
vi.mock('../hooks/usePublicAuthPasswordRecoveryIdempotencyKey', () => ({ usePublicAuthPasswordRecoveryIdempotencyKey: () => ({ getKey: mocks.getKey, clearKey: mocks.clearKey }) }));
vi.mock('../api/PublicAuthPasswordRecoveryApi', () => ({ PublicAuthPasswordRecoveryApiError: class extends Error { constructor(message: string, readonly code: string, readonly validationErrors = []) { super(message); } }, getPublicAuthPasswordRecoveryApiErrorMessage: () => 'Request could not be completed' }));

beforeEach(() => { vi.clearAllMocks(); mocks.mutateAsync.mockReset(); mocks.mutateAsync.mockResolvedValue({ success: true, message: 'Accepted', data: null }); });

describe('PublicAuthPasswordRecoveryPage', () => {
  it('fails closed for absolute or query-bearing recovery endpoint values', () => {
    expect(requirePublicAuthPasswordRecoveryEndpointPath('/api/auth/forgot-password')).toBe('/api/auth/forgot-password');
    expect(() => requirePublicAuthPasswordRecoveryEndpointPath('https://example.invalid/recovery')).toThrow();
    expect(() => requirePublicAuthPasswordRecoveryEndpointPath('/api/auth/forgot-password?identity=private')).toThrow();
  });
  afterEach(() => vi.unstubAllEnvs());
  it('fills the identity field from a synthetic fixture without submitting', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthPasswordRecoveryPage />);
    fireEvent.click(screen.getByTestId('auth-forgot-demo-fill'));
    expect(screen.getByTestId('auth-forgot-identity-input')).toHaveValue('person@example.invalid');
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('keeps identity validation active after demo-filled identity is cleared', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthPasswordRecoveryPage />);
    fireEvent.click(screen.getByTestId('auth-forgot-demo-fill'));
    fireEvent.change(screen.getByTestId('auth-forgot-identity-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('auth-forgot-submit'));
    expect(await screen.findByTestId('auth-forgot-identity-validation-error')).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('hides demo fill in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthPasswordRecoveryPage />);
    expect(screen.queryByTestId('auth-forgot-demo-fill')).not.toBeInTheDocument();
  });

  it('requires the existing identity field', () => {
    render(<PublicAuthPasswordRecoveryPage />);
    expect(screen.getByTestId('auth-forgot-identity-input')).toBeRequired();
  });
  it('submits only identity and shows generic accepted state after successful response', async () => {
    render(<PublicAuthPasswordRecoveryPage />);
    fireEvent.change(screen.getByTestId('auth-forgot-identity-input'), { target: { value: 'person@example.invalid' } });
    fireEvent.click(screen.getByTestId('auth-forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('auth-forgot-accepted-state')).toBeInTheDocument());
    expect(mocks.mutateAsync).toHaveBeenCalledWith({ payload: { identity: 'person@example.invalid' }, idempotencyKey: 'synthetic-idempotency-key' });
    expect(screen.getByTestId('auth-forgot-accepted-state')).not.toHaveTextContent(/code sent|email sent|phone sent/i);
  });
  it('keeps the entered identity and permits retry after a rejected request', async () => {
    mocks.mutateAsync.mockRejectedValueOnce(new Error('synthetic failure'));
    render(<PublicAuthPasswordRecoveryPage />);
    const identity = screen.getByTestId('auth-forgot-identity-input');
    fireEvent.change(identity, { target: { value: 'person@example.invalid' } });
    fireEvent.click(screen.getByTestId('auth-forgot-submit'));
    await waitFor(() => expect(screen.getByTestId('auth-forgot-server-error-state')).toBeInTheDocument());
    expect(identity).toHaveValue('person@example.invalid');
    mocks.mutateAsync.mockResolvedValueOnce({ success: true, message: 'Accepted', data: null });
    await act(async () => { fireEvent.click(screen.getByTestId('auth-forgot-submit')); });
    await waitFor(() => expect(screen.getByTestId('auth-forgot-accepted-state')).toBeInTheDocument());
    expect(mocks.mutateAsync).toHaveBeenCalledTimes(2);
  });
});
