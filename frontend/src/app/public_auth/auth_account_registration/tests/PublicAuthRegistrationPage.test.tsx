import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicAuthRegistrationPage from '@/app/public_auth/auth_account_registration/components/PublicAuthRegistrationPage';
import { requirePublicAuthRegistrationEndpointPath } from '@/app/public_auth/auth_account_registration/utils/PublicAuthRegistrationUrlGuard';

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn(), getKey: vi.fn(async () => 'synthetic-idempotency-key'), clearKey: vi.fn(), replace: vi.fn() }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace, push: vi.fn() }) }));
vi.mock('../hooks/usePublicAuthRegistrationMutation', () => ({ usePublicAuthRegistrationMutation: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }) }));
vi.mock('../hooks/usePublicAuthRegistrationIdempotencyKey', () => ({ usePublicAuthRegistrationIdempotencyKey: () => ({ getKey: mocks.getKey, clearKey: mocks.clearKey }) }));
vi.mock('../api/PublicAuthRegistrationApi', () => ({ PublicAuthRegistrationApiError: class extends Error { constructor(message: string, readonly code: string, readonly validationErrors = []) { super(message); } }, getPublicAuthRegistrationApiErrorMessage: () => 'Request could not be completed' }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mutateAsync.mockReset();
  mocks.mutateAsync.mockResolvedValue({ success: true, message: 'Accepted', data: null });
});

describe('PublicAuthRegistrationPage critical controls', () => {
  it('fails closed for absolute or query-bearing registration endpoint values', () => {
    expect(requirePublicAuthRegistrationEndpointPath('/api/auth/signup')).toBe('/api/auth/signup');
    expect(() => requirePublicAuthRegistrationEndpointPath('https://example.invalid/signup')).toThrow();
    expect(() => requirePublicAuthRegistrationEndpointPath('/api/auth/signup?redirect=external')).toThrow();
  });
  afterEach(() => vi.unstubAllEnvs());
  it('fills all six signup fields from synthetic fixture data without submitting', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthRegistrationPage />);
    fireEvent.click(screen.getByTestId('auth-signup-demo-fill'));
    expect(screen.getByTestId('auth-signup-owner-name-input')).toHaveValue('Audit User');
    expect(screen.getByTestId('auth-signup-library-name-input')).toHaveValue('Example Library');
    expect(screen.getByTestId('auth-signup-email-input')).toHaveValue('person@example.invalid');
    expect(screen.getByTestId('auth-signup-phone-input')).toHaveValue('+919876543210');
    expect(screen.getByTestId('auth-signup-password-input')).toHaveValue('SyntheticPassword1');
    expect(screen.getByTestId('auth-signup-confirm-password-input')).toHaveValue('SyntheticPassword1');
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('keeps schema validation active after a demo-filled field is cleared', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthRegistrationPage />);
    fireEvent.click(screen.getByTestId('auth-signup-demo-fill'));
    fireEvent.change(screen.getByTestId('auth-signup-owner-name-input'), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    expect(await screen.findByTestId('auth-signup-owner-validation-error')).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('hides demo fill in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthRegistrationPage />);
    expect(screen.queryByTestId('auth-signup-demo-fill')).not.toBeInTheDocument();
  });

  it('marks all schema-required visible signup fields as required', () => {
    render(<PublicAuthRegistrationPage />);
    for (const testId of ['auth-signup-owner-name-input', 'auth-signup-library-name-input', 'auth-signup-email-input', 'auth-signup-phone-input', 'auth-signup-password-input', 'auth-signup-confirm-password-input']) {
      expect(screen.getByTestId(testId)).toBeRequired();
    }
    expect(screen.getAllByText('COMMON.required', { selector: '.sr-only' }).length).toBeGreaterThan(0);
  });

  it('toggles password visibility without changing the password value', () => {
    render(<PublicAuthRegistrationPage />);
    const password = screen.getByTestId('auth-signup-password-input');
    fireEvent.change(password, { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-signup-password-toggle'));
    expect(password).toHaveAttribute('type', 'text');
    expect(password).toHaveValue('SyntheticPassword1');
  });

  it('locks signup fields while pending and restores them for retry after rejection', async () => {
    let rejectSignup!: (reason?: unknown) => void;
    mocks.mutateAsync.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectSignup = reject; }));
    render(<PublicAuthRegistrationPage />);
    const owner = screen.getByTestId('auth-signup-owner-name-input');
    const library = screen.getByTestId('auth-signup-library-name-input');
    const email = screen.getByTestId('auth-signup-email-input');
    const phone = screen.getByTestId('auth-signup-phone-input');
    const password = screen.getByTestId('auth-signup-password-input');
    const confirm = screen.getByTestId('auth-signup-confirm-password-input');
    fireEvent.change(owner, { target: { value: 'Audit User' } });
    fireEvent.change(library, { target: { value: 'Example Library' } });
    fireEvent.change(email, { target: { value: 'person@example.invalid' } });
    fireEvent.change(phone, { target: { value: '+919876543210' } });
    fireEvent.change(password, { target: { value: 'SyntheticPassword1' } });
    fireEvent.change(confirm, { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    await waitFor(() => expect(screen.getByTestId('auth-signup-submit')).toBeDisabled());
    for (const control of [owner, library, email, phone, password, confirm]) expect(control).toBeDisabled();
    expect(screen.getByTestId('auth-signup-password-toggle')).toBeDisabled();
    expect(screen.getByTestId('auth-signup-confirm-password-toggle')).toBeDisabled();

    await act(async () => { rejectSignup(new Error('temporary rejection')); });
    await waitFor(() => expect(screen.getByTestId('auth-signup-server-error-state')).toBeInTheDocument());
    expect(owner).toBeEnabled();
    expect(email).toHaveValue('person@example.invalid');
    expect(password).toHaveValue('SyntheticPassword1');

    mocks.mutateAsync.mockResolvedValueOnce({ success: true, message: 'Accepted', data: null });
    fireEvent.click(screen.getByTestId('auth-signup-submit'));
    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/superadmin/superadmin_setup-wizard'));
    expect(mocks.mutateAsync).toHaveBeenLastCalledWith({ payload: { ownerName: 'Audit User', libraryName: 'Example Library', email: 'person@example.invalid', phone: '+919876543210', password: 'SyntheticPassword1' }, idempotencyKey: 'synthetic-idempotency-key' });
    expect(mocks.mutateAsync).toHaveBeenCalledTimes(2);
  });

});
