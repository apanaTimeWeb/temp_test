'use client';
import { useMutation } from '@tanstack/react-query';
import { resetPublicAuthPassword } from '@/app/frontend_public/public_auth/auth_password_reset/api/PublicAuthPasswordResetApi';
import type { PublicAuthPasswordResetRequest } from '@/app/frontend_public/public_auth/auth_password_reset/types/PublicAuthPasswordResetApiTypes';
interface Variables { payload: PublicAuthPasswordResetRequest; idempotencyKey: string; }
/** Reset mutation submits the observed combined OTP/password payload; no separate OTP operation is introduced. */
export function usePublicAuthPasswordResetMutation() { return useMutation({ mutationKey: ['auth', 'password-reset'], mutationFn: ({ payload, idempotencyKey }: Variables) => resetPublicAuthPassword(payload, idempotencyKey) }); }
