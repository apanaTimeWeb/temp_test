import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import { PUBLIC_AUTH_LOGIN_URL } from '@/app/public_auth/auth_sign_in/config/public_auth_sign_in_url_config';
import { requirePublicAuthEndpointPath } from '@/app/public_auth/auth_sign_in/utils/PublicAuthSignInUrlGuard';
import type { PublicAuthApiEnvelope, PublicAuthApiValidationError, PublicAuthLoginRequest } from '@/app/public_auth/auth_sign_in/types/PublicAuthSignInApiTypes';

const authApiEnvelopeSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().refine((value) => value !== undefined, 'Required by the observed frontend API envelope').nullable(),
  error: z.string().optional(),
  errorCode: z.string().optional(),
  statusCode: z.number().optional(),
  validationErrors: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
}).passthrough();

/** Safe internal classification; server text is not trusted as user-facing copy. */
export type PublicAuthApiErrorCode = 'CONFIGURATION' | 'CONNECTION' | 'UNEXPECTED_RESPONSE' | 'REQUEST_REJECTED';

/** Localized, user-safe copy supplied by the owning form. */
export interface PublicAuthApiErrorMessages {
  configuration: string;
  connection: string;
  requestFailed: string;
  unexpected: string;
}

/** Typed API failure with filtered field details and no raw transport response. */
export class PublicAuthApiError extends Error {
  readonly validationErrors: readonly PublicAuthApiValidationError[];

  constructor(message: string, readonly code: PublicAuthApiErrorCode, validationErrors: readonly PublicAuthApiValidationError[] = []) {
    super(message);
    this.name = 'PublicAuthApiError';
    this.validationErrors = validationErrors.filter(
      (item) => typeof item.field === 'string' && item.field.trim().length > 0
        && typeof item.message === 'string' && item.message.trim().length > 0,
    );
  }
}

/** Map transport failures to localized safe copy; never display raw server messages. */
export function getPublicAuthApiErrorMessage(error: unknown, messages: PublicAuthApiErrorMessages): string {
  if (!(error instanceof PublicAuthApiError)) return messages.unexpected;
  if (error.code === 'CONFIGURATION') return messages.configuration;
  if (error.code === 'CONNECTION') return messages.connection;
  if (error.code === 'UNEXPECTED_RESPONSE') return messages.unexpected;
  if (error.code === 'REQUEST_REJECTED') return messages.requestFailed;
  return messages.unexpected;
}

/** Submits a login request using the host API transport and supplied idempotency key. */
export async function loginPublicAuth(payload: PublicAuthLoginRequest, idempotencyKey: string): Promise<PublicAuthApiEnvelope> {
  let path: string;
  try {
    path = requirePublicAuthEndpointPath(PUBLIC_AUTH_LOGIN_URL, 'NEXT_PUBLIC_AUTH_LOGIN_PATH');
  } catch {
    throw new PublicAuthApiError('AUTH_ENDPOINT_CONFIGURATION_MISSING', 'CONFIGURATION');
  }

  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    throw new PublicAuthApiError('AUTH_REQUEST_KEY_INVALID', 'UNEXPECTED_RESPONSE');
  }

  let response: Response;
  try {
    response = await apiFetch(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    });
  } catch {
    throw new PublicAuthApiError('AUTH_SERVICE_UNREACHABLE', 'CONNECTION');
  }

  let rawResponse: unknown;
  try {
    rawResponse = await response.json();
  } catch {
    throw new PublicAuthApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const parsedResponse = authApiEnvelopeSchema.safeParse(rawResponse);
  if (!parsedResponse.success) {
    throw new PublicAuthApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const envelope = parsedResponse.data;
  if (!response.ok || !envelope.success) {
    // Preserve field identity for known form controls; server-provided text remains untrusted.
    throw new PublicAuthApiError(
      'AUTH_REQUEST_REJECTED',
      'REQUEST_REJECTED',
      envelope.success ? [] : envelope.validationErrors ?? [],
    );
  }

  return envelope;
}
