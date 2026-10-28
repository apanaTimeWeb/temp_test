import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicAuthSignInPage from '@/app/frontend_public/public_auth/auth_sign_in/components/PublicAuthSignInPage';
import { PublicAuthApiError } from '@/app/frontend_public/public_auth/auth_sign_in/api/PublicAuthSignInApi';
import { requirePublicAuthEndpointPath } from '@/app/frontend_public/public_auth/auth_sign_in/utils/PublicAuthSignInUrlGuard';
const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  mutateAsync: vi.fn(),
  getKey: vi.fn(async () => 'synthetic-idempotency-key'),
  clearKey: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('../hooks/usePublicAuthSignInMutation', () => ({ usePublicAuthLoginMutation: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }) }));
vi.mock('../hooks/usePublicAuthSignInIdempotencyKey', () => ({ usePublicAuthIdempotencyKey: () => ({ getKey: mocks.getKey, clearKey: mocks.clearKey }) }));
// Prevent network/API implementation details from being exercised in this component interaction test.
vi.mock('../api/PublicAuthSignInApi', () => ({
  PublicAuthApiError: class extends Error { constructor(message: string, readonly code: string, readonly validationErrors = []) { super(message); } },
  getPublicAuthApiErrorMessage: () => 'Request could not be completed',
}));

describe('PublicAuthSignInPage critical controls', () => {
  it('fails closed for unapproved login endpoint forms', () => {
    expect(requirePublicAuthEndpointPath('/api/auth/login', 'NEXT_PUBLIC_AUTH_LOGIN_PATH')).toBe('/api/auth/login');
    expect(() => requirePublicAuthEndpointPath('https://example.invalid/login', 'NEXT_PUBLIC_AUTH_LOGIN_PATH')).toThrow();
    expect(() => requirePublicAuthEndpointPath('/api/auth/login?next=external', 'NEXT_PUBLIC_AUTH_LOGIN_PATH')).toThrow();
  });
  afterEach(() => vi.unstubAllEnvs());
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.mutateAsync.mockReset();
    mocks.mutateAsync.mockResolvedValue({ success: true, message: 'Accepted', data: null });
  });

  it('fills every sign-in field only when the non-production demo flag is enabled', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthSignInPage />);
    fireEvent.click(screen.getByTestId('auth-login-demo-fill'));
    expect(screen.getByTestId('auth-login-email-input')).toHaveValue('person@example.invalid');
    expect(screen.getByTestId('auth-login-password-input')).toHaveValue('SyntheticPassword1');
    expect(screen.getByTestId('auth-login-role-value')).toHaveValue('admin');
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('keeps schema validation active after demo values are edited to invalid input', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthSignInPage />);
    fireEvent.click(screen.getByTestId('auth-login-demo-fill'));
    fireEvent.change(screen.getByTestId('auth-login-email-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    expect(await screen.findByTestId('auth-login-email-validation-error')).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('does not render demo fill in production even if the flag is enabled', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthSignInPage />);
    expect(screen.queryByTestId('auth-login-demo-fill')).not.toBeInTheDocument();
  });

  it('marks required credentials semantically and exposes a localized required indicator', () => {
    render(<PublicAuthSignInPage />);
    expect(screen.getByTestId('auth-login-email-input')).toBeRequired();
    expect(screen.getByTestId('auth-login-password-input')).toBeRequired();
    expect(screen.getAllByText('COMMON.required', { selector: '.sr-only' })).toHaveLength(2);
  });

  it('updates selected role state and its accessible pressed state', () => {
    render(<PublicAuthSignInPage />);
    const adminRole = screen.getByTestId('auth-login-role-admin-select');
    fireEvent.click(adminRole);
    expect(adminRole).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('auth-login-role-value')).toHaveValue('admin');
  });

  it('toggles password visibility using the accessible control', () => {
    render(<PublicAuthSignInPage />);
    const password = screen.getByTestId('auth-login-password-input');
    expect(password).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByTestId('auth-login-password-toggle'));
    expect(password).toHaveAttribute('type', 'text');
  });

  it('maps recognized server validation fields to accessible field errors without exposing server text', async () => {
    mocks.mutateAsync.mockRejectedValueOnce(new PublicAuthApiError('raw backend detail', 'REQUEST_REJECTED', [
      { field: 'email', message: 'Private server email detail' },
      { field: 'password', message: 'Internal password policy detail' },
    ]));
    render(<PublicAuthSignInPage />);
    fireEvent.change(screen.getByTestId('auth-login-email-input'), { target: { value: 'person@example.invalid' } });
    fireEvent.change(screen.getByTestId('auth-login-password-input'), { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    const emailError = await screen.findByTestId('auth-login-email-validation-error');
    const passwordError = await screen.findByTestId('auth-login-password-validation-error');
    expect(emailError).toHaveTextContent('errors.requestFailed');
    expect(passwordError).toHaveTextContent('errors.requestFailed');
    expect(screen.getByTestId('auth-login-email-input')).toHaveAttribute('aria-describedby', 'auth-login-email-error');
    expect(screen.getByTestId('auth-login-password-input')).toHaveAttribute('aria-describedby', 'auth-login-password-error');
    expect(screen.queryByTestId('auth-login-server-error-state')).not.toBeInTheDocument();
    expect(document.body).not.toHaveTextContent('Private server email detail');
  });

  it('routes unknown server validation fields to the safe root error', async () => {
    mocks.mutateAsync.mockRejectedValueOnce(new PublicAuthApiError('AUTH_REQUEST_REJECTED', 'REQUEST_REJECTED', [
      { field: 'accountInternalId', message: 'Private backend detail' },
    ]));
    render(<PublicAuthSignInPage />);
    fireEvent.change(screen.getByTestId('auth-login-email-input'), { target: { value: 'person@example.invalid' } });
    fireEvent.change(screen.getByTestId('auth-login-password-input'), { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    expect(await screen.findByTestId('auth-login-server-error-state')).toHaveTextContent('Request could not be completed');
    expect(document.body).not.toHaveTextContent('Private backend detail');
  });

  it('locks credentials and role selection while pending, then permits retry after rejection', async () => {
    let rejectLogin!: (reason?: unknown) => void;
    mocks.mutateAsync.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectLogin = reject; }));
    render(<PublicAuthSignInPage />);
    const email = screen.getByTestId('auth-login-email-input');
    const password = screen.getByTestId('auth-login-password-input');
    const roleButton = screen.getByTestId('auth-login-role-admin-select');
    fireEvent.change(email, { target: { value: 'person@example.invalid' } });
    fireEvent.change(password, { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-login-submit'));

    await waitFor(() => expect(screen.getByTestId('auth-login-submit')).toBeDisabled());
    expect(email).toBeDisabled();
    expect(password).toBeDisabled();
    expect(screen.getByTestId('auth-login-password-toggle')).toBeDisabled();
    expect(roleButton).toBeDisabled();

    await act(async () => { rejectLogin(new Error('temporary rejection')); });
    await waitFor(() => expect(screen.getByTestId('auth-login-server-error-state')).toBeInTheDocument());
    expect(email).toBeEnabled();
    expect(password).toBeEnabled();
    expect(roleButton).toBeEnabled();
    expect(email).toHaveValue('person@example.invalid');

    mocks.mutateAsync.mockResolvedValueOnce({ success: true, message: 'Accepted', data: null });
    fireEvent.click(screen.getByTestId('auth-login-submit'));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/superadmin/superadmin_dashboard'));
    expect(mocks.mutateAsync).toHaveBeenLastCalledWith({ payload: { email: 'person@example.invalid', password: 'SyntheticPassword1', role: 'superadmin' }, idempotencyKey: 'synthetic-idempotency-key' });
    expect(mocks.mutateAsync).toHaveBeenCalledTimes(2);
  });

});
