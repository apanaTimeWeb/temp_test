import '@testing-library/jest-dom/vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PublicAuthResetPasswordPage from '@/app/frontend_public/public_auth/auth_password_reset/components/PublicAuthResetPasswordPage';
import { requirePublicAuthPasswordResetEndpointPath } from '@/app/frontend_public/public_auth/auth_password_reset/utils/PublicAuthPasswordResetUrlGuard';

const mocks = vi.hoisted(() => ({ mutateAsync: vi.fn(), getKey: vi.fn(async () => 'synthetic-idempotency-key'), clearKey: vi.fn() }));
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }));
vi.mock('../hooks/usePublicAuthPasswordResetMutation', () => ({ usePublicAuthPasswordResetMutation: () => ({ mutateAsync: mocks.mutateAsync, isPending: false }) }));
vi.mock('../hooks/usePublicAuthPasswordResetIdempotencyKey', () => ({ usePublicAuthPasswordResetIdempotencyKey: () => ({ getKey: mocks.getKey, clearKey: mocks.clearKey }) }));
vi.mock('../api/PublicAuthPasswordResetApi', () => ({ PublicAuthPasswordResetApiError: class extends Error { constructor(message: string, readonly code: string, readonly validationErrors = []) { super(message); } }, getPublicAuthPasswordResetApiErrorMessage: () => 'Request could not be completed' }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.mutateAsync.mockReset();
  mocks.mutateAsync.mockResolvedValue({ success: true, message: 'Accepted', data: null });
});


describe('PublicAuthResetPasswordPage critical controls', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('fails closed for absolute or query-bearing reset endpoint values', () => {
    expect(requirePublicAuthPasswordResetEndpointPath('/api/auth/reset-password')).toBe('/api/auth/reset-password');
    expect(() => requirePublicAuthPasswordResetEndpointPath('https://example.invalid/reset')).toThrow();
    expect(() => requirePublicAuthPasswordResetEndpointPath('/api/auth/reset-password?token=bad')).toThrow();
  });
  it('fills all six OTP digits and both password fields without submitting', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthResetPasswordPage />);
    fireEvent.click(screen.getByTestId('auth-reset-demo-fill'));
    for (const [index, digit] of Array.from('123456'.split('').entries())) expect(screen.getByTestId(`auth-reset-otp-digit-${index + 1}-input`)).toHaveValue(digit);
    expect(screen.getByTestId('auth-reset-otp-value')).toHaveValue('123456');
    expect(screen.getByTestId('auth-reset-password-input')).toHaveValue('SyntheticPassword1');
    expect(screen.getByTestId('auth-reset-confirm-password-input')).toHaveValue('SyntheticPassword1');
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('keeps OTP validation active after demo-filled digits are cleared', async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthResetPasswordPage />);
    fireEvent.click(screen.getByTestId('auth-reset-demo-fill'));
    for (let index = 1; index <= 6; index += 1) fireEvent.change(screen.getByTestId(`auth-reset-otp-digit-${index}-input`), { target: { value: '' } });
    fireEvent.click(screen.getByTestId('auth-reset-submit'));
    expect(await screen.findByTestId('auth-reset-otp-validation-error')).toBeInTheDocument();
    expect(mocks.mutateAsync).not.toHaveBeenCalled();
  });

  it('hides demo fill in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_AUTH_DEMO_FILL_ENABLED', 'true');
    render(<PublicAuthResetPasswordPage />);
    expect(screen.queryByTestId('auth-reset-demo-fill')).not.toBeInTheDocument();
  });

  it('marks the OTP and both password fields as required', () => {
    render(<PublicAuthResetPasswordPage />);
    for (const testId of ['auth-reset-otp-digit-1-input', 'auth-reset-otp-digit-2-input', 'auth-reset-otp-digit-3-input', 'auth-reset-otp-digit-4-input', 'auth-reset-otp-digit-5-input', 'auth-reset-otp-digit-6-input', 'auth-reset-password-input', 'auth-reset-confirm-password-input']) {
      expect(screen.getByTestId(testId)).toBeRequired();
    }
    expect(screen.getAllByText('COMMON.required', { selector: '.sr-only' }).length).toBeGreaterThan(0);
  });

  it('keeps the six-digit OTP value synchronized with the visible OTP group', () => {
    render(<PublicAuthResetPasswordPage />);
    const digits = screen.getAllByRole('textbox', { name: /digit/i });
    fireEvent.change(digits[0], { target: { value: '1' } });
    fireEvent.change(digits[1], { target: { value: '2' } });
    expect(screen.getByTestId('auth-reset-otp-value')).toHaveValue('12');
  });

  it('distributes pasted OTP digits across the six slots', () => {
    render(<PublicAuthResetPasswordPage />);
    fireEvent.paste(screen.getByTestId('auth-reset-otp-group'), { clipboardData: { getData: () => '12 34-56' } });
    expect(screen.getByTestId('auth-reset-otp-value')).toHaveValue('123456');
    for (const [index, digit] of Array.from('123456'.split('').entries())) {
      expect(screen.getByTestId(`auth-reset-otp-digit-${index + 1}-input`)).toHaveValue(digit);
    }
  });

  it('moves OTP focus with arrow keys and backspace', () => {
    render(<PublicAuthResetPasswordPage />);
    const first = screen.getByTestId('auth-reset-otp-digit-1-input');
    const second = screen.getByTestId('auth-reset-otp-digit-2-input');
    const third = screen.getByTestId('auth-reset-otp-digit-3-input');
    third.focus();
    fireEvent.keyDown(third, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(document.activeElement).toBe(first);
  });

  it('associates OTP validation feedback with every digit input', async () => {
    render(<PublicAuthResetPasswordPage />);
    fireEvent.click(screen.getByTestId('auth-reset-submit'));
    const error = await screen.findByTestId('auth-reset-otp-validation-error');
    const digits = screen.getAllByRole('textbox', { name: /digit/i });
    expect(error).toHaveAttribute('id', 'auth-reset-otp-error');
    for (const digit of digits) {
      expect(digit).toHaveAttribute('aria-invalid', 'true');
      expect(digit).toHaveAttribute('aria-describedby', 'auth-reset-otp-error');
    }
  });

  it('locks OTP/password controls while pending and allows retry after rejection', async () => {
    let rejectReset!: (reason?: unknown) => void;
    mocks.mutateAsync.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectReset = reject; }));
    render(<PublicAuthResetPasswordPage />);
    const digits = screen.getAllByRole('textbox', { name: /digit/i });
    for (const [index, digit] of Array.from('123456'.split('').entries())) fireEvent.change(digits[index], { target: { value: digit } });
    const password = screen.getByTestId('auth-reset-password-input');
    const confirm = screen.getByTestId('auth-reset-confirm-password-input');
    fireEvent.change(password, { target: { value: 'SyntheticPassword1' } });
    fireEvent.change(confirm, { target: { value: 'SyntheticPassword1' } });
    fireEvent.click(screen.getByTestId('auth-reset-submit'));

    await waitFor(() => expect(screen.getByTestId('auth-reset-submit')).toBeDisabled());
    for (const digit of digits) expect(digit).toBeDisabled();
    expect(password).toBeDisabled();
    expect(confirm).toBeDisabled();
    expect(screen.getByTestId('auth-reset-password-toggle')).toBeDisabled();
    expect(screen.getByTestId('auth-reset-confirm-password-toggle')).toBeDisabled();

    await act(async () => { rejectReset(new Error('temporary rejection')); });
    await waitFor(() => expect(screen.getByTestId('auth-reset-server-error-state')).toBeInTheDocument());
    expect(digits[0]).toBeEnabled();
    expect(password).toBeEnabled();
    expect(password).toHaveValue('SyntheticPassword1');
    expect(confirm).toHaveValue('SyntheticPassword1');

    mocks.mutateAsync.mockResolvedValueOnce({ success: true, message: 'Accepted', data: null });
    fireEvent.click(screen.getByTestId('auth-reset-submit'));
    await waitFor(() => expect(screen.getByTestId('auth-reset-completed-state')).toBeInTheDocument());
    expect(mocks.mutateAsync).toHaveBeenLastCalledWith({ payload: { otp: '123456', newPassword: 'SyntheticPassword1' }, idempotencyKey: 'synthetic-idempotency-key' });
    expect(mocks.mutateAsync).toHaveBeenCalledTimes(2);
  });

});
