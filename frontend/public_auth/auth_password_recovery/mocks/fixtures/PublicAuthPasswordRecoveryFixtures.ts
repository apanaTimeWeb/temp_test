import type { PublicAuthPasswordRecoveryApiEnvelope, PublicAuthPasswordRecoveryRequest } from '@/app/frontend_public/public_auth/auth_password_recovery/types/PublicAuthPasswordRecoveryApiTypes';

/** Synthetic-only fixtures for local tests; never used as proof of real delivery or account existence. */
export const publicAuthPasswordRecoveryAcceptedFixture: PublicAuthPasswordRecoveryApiEnvelope = {
  success: true,
  message: 'Accepted',
  data: null,
};
export const publicAuthPasswordRecoveryRejectedFixture: PublicAuthPasswordRecoveryApiEnvelope = {
  success: false,
  message: 'Rejected',
  data: null,
};
export const publicAuthPasswordRecoveryRequestFixture: PublicAuthPasswordRecoveryRequest = { identity: 'person@example.invalid' };

/** Deliberately malformed test-only response for parser coverage; not a backend contract. */
export const publicAuthPasswordRecoveryInvalidEnvelopeFixture = { success: 'not-a-boolean' } as const;
