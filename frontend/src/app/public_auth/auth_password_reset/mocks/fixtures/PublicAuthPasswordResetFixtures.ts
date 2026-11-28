import type { PublicAuthPasswordResetRequest } from '@/app/public_auth/auth_password_reset/types/PublicAuthPasswordResetApiTypes';

/** Synthetic component-test values only; never a real challenge and never auto-submitted. */
export const PUBLIC_AUTH_PASSWORD_RESET_DEMO: PublicAuthPasswordResetRequest & { confirmPassword: string } = {
  otp: '123456',
  newPassword: 'SyntheticPassword1',
  confirmPassword: 'SyntheticPassword1',
};
