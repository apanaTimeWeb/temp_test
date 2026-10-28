'use client';
import { useMutation } from '@tanstack/react-query';
import { createPublicAuthRegistration } from '../api/PublicAuthRegistrationApi';
import type { PublicAuthRegistrationRequest } from '../types/PublicAuthRegistrationApiTypes';
interface Variables { payload: PublicAuthRegistrationRequest; idempotencyKey: string; }
/** Registration mutation is owned by this autonomous submodule. */
export function usePublicAuthRegistrationMutation() { return useMutation({ mutationKey: ['public-auth-registration', 'create'], mutationFn: ({ payload, idempotencyKey }: Variables) => createPublicAuthRegistration(payload, idempotencyKey) }); }
