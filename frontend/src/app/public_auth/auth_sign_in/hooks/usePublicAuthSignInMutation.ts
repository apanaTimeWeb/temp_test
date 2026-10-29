'use client';

import { useMutation } from '@tanstack/react-query';
import { loginPublicAuth } from '@/app/public_auth/auth_sign_in/api/PublicAuthSignInApi';
import type { PublicAuthLoginRequest } from '@/app/public_auth/auth_sign_in/types/PublicAuthSignInApiTypes';

interface PublicAuthLoginMutationVariables {
  payload: PublicAuthLoginRequest;
  idempotencyKey: string;
}

/**
 * Owns TanStack Query v5 pending/error lifecycle for the auth login mutation.
 * Dependencies: the feature API client and a required per-intent idempotency key supplied by the form.
 * Edge cases: request rejection remains a rejected mutation so the form can announce a localized error; server session/cache invalidation is a host contract and is intentionally not guessed here.
 */
export function usePublicAuthLoginMutation() {
  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: ({ payload, idempotencyKey }: PublicAuthLoginMutationVariables) => loginPublicAuth(payload, idempotencyKey),
  });
}
