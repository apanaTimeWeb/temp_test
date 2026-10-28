import type { PublicAuthPasswordResetApiEnvelope, PublicAuthPasswordResetRequest } from '@/app/frontend_public/public_auth/auth_password_reset/types/PublicAuthPasswordResetApiTypes';

/** Synthetic response fixtures only; no server contract is inferred from these test fixtures. */
export const acceptedResetFixture: PublicAuthPasswordResetApiEnvelope = { success: true, message: 'Accepted', data: null };
export const rejectedResetFixture: PublicAuthPasswordResetApiEnvelope = { success: false, message: 'Request rejected', data: null, errorCode: 'REQUEST_REJECTED' };
/** Deliberately malformed test-only envelope for parser coverage. */
export const invalidResetEnvelopeFixture = { success: 'not-a-boolean' } as const;

/** Synthetic component-test values only; never a real challenge and never auto-submitted. */
export const PUBLIC_AUTH_PASSWORD_RESET_DEMO: PublicAuthPasswordResetRequest & { confirmPassword: string } = {
  otp: '123456',
  newPassword: 'SyntheticPassword1',
  confirmPassword: 'SyntheticPassword1',
};
