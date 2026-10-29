import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import { PUBLIC_AUTH_PASSWORD_RESET_API_PATH } from '@/app/public_auth/auth_password_reset/config/public_auth_password_reset_url_config';
import { requirePublicAuthPasswordResetEndpointPath } from '@/app/public_auth/auth_password_reset/utils/PublicAuthPasswordResetUrlGuard';
import type { PublicAuthPasswordResetApiEnvelope, PublicAuthPasswordResetRequest, PublicAuthPasswordResetValidationError } from '@/app/public_auth/auth_password_reset/types/PublicAuthPasswordResetApiTypes';

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
export type PublicAuthPasswordResetApiErrorCode = 'CONFIGURATION' | 'CONNECTION' | 'UNEXPECTED_RESPONSE' | 'REQUEST_REJECTED';

/** Localized, user-safe copy supplied by the owning form. */
export interface PublicAuthPasswordResetApiErrorMessages {
  configuration: string;
  connection: string;
  requestFailed: string;
  unexpected: string;
}

/** Typed API failure with filtered field details and no raw transport response. */
export class PublicAuthPasswordResetApiError extends Error {
  readonly validationErrors: readonly PublicAuthPasswordResetValidationError[];

  constructor(message: string, readonly code: PublicAuthPasswordResetApiErrorCode, validationErrors: readonly PublicAuthPasswordResetValidationError[] = []) {
    super(message);
    this.name = 'PublicAuthPasswordResetApiError';
    this.validationErrors = validationErrors.filter(
      (item) => typeof item.field === 'string' && item.field.trim().length > 0
        && typeof item.message === 'string' && item.message.trim().length > 0,
    );
  }
}

/** Map transport failures to localized safe copy; never display raw server messages. */
export function getPublicAuthPasswordResetApiErrorMessage(error: unknown, messages: PublicAuthPasswordResetApiErrorMessages): string {
  if (!(error instanceof PublicAuthPasswordResetApiError)) return messages.unexpected;
  if (error.code === 'CONFIGURATION') return messages.configuration;
  if (error.code === 'CONNECTION') return messages.connection;
  if (error.code === 'UNEXPECTED_RESPONSE') return messages.unexpected;
  if (error.code === 'REQUEST_REJECTED') return messages.requestFailed;
  return messages.unexpected;
}

/** Submits the existing OTP-plus-password reset payload through the host API transport. */
export async function resetPublicAuthPassword(payload: PublicAuthPasswordResetRequest, idempotencyKey: string): Promise<PublicAuthPasswordResetApiEnvelope> {
  let path: string;
  try {
    path = requirePublicAuthPasswordResetEndpointPath(PUBLIC_AUTH_PASSWORD_RESET_API_PATH);
  } catch {
    throw new PublicAuthPasswordResetApiError('AUTH_ENDPOINT_CONFIGURATION_MISSING', 'CONFIGURATION');
  }

  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    throw new PublicAuthPasswordResetApiError('AUTH_REQUEST_KEY_INVALID', 'UNEXPECTED_RESPONSE');
  }

  let response: Response;
  try {
    response = await apiFetch(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    });
  } catch {
    throw new PublicAuthPasswordResetApiError('AUTH_SERVICE_UNREACHABLE', 'CONNECTION');
  }

  let rawResponse: unknown;
  try {
    rawResponse = await response.json();
  } catch {
    throw new PublicAuthPasswordResetApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const parsedResponse = authApiEnvelopeSchema.safeParse(rawResponse);
  if (!parsedResponse.success) {
    throw new PublicAuthPasswordResetApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const envelope = parsedResponse.data;
  if (!response.ok || !envelope.success) {
    // Preserve field identity for known form controls; server-provided text remains untrusted.
    throw new PublicAuthPasswordResetApiError(
      'AUTH_REQUEST_REJECTED',
      'REQUEST_REJECTED',
      envelope.success ? [] : envelope.validationErrors ?? [],
    );
  }

  return envelope;
}
