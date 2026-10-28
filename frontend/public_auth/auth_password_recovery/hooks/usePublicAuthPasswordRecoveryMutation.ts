'use client';
import { useMutation } from '@tanstack/react-query';
import { requestPublicAuthPasswordRecovery } from '@/app/frontend_public/public_auth/auth_password_recovery/api/PublicAuthPasswordRecoveryApi';
import type { PublicAuthPasswordRecoveryRequest } from '@/app/frontend_public/public_auth/auth_password_recovery/types/PublicAuthPasswordRecoveryApiTypes';

interface Variables { payload: PublicAuthPasswordRecoveryRequest; idempotencyKey: string; }
/** Module-local mutation; backend request contract remains the observed identity-only payload. */
export function usePublicAuthPasswordRecoveryMutation() {
  return useMutation({ mutationKey: ['auth', 'password-recovery'], mutationFn: ({ payload, idempotencyKey }: Variables) => requestPublicAuthPasswordRecovery(payload, idempotencyKey) });
}
