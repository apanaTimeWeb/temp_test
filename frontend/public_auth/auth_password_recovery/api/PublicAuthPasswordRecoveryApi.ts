import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import { PUBLIC_AUTH_PASSWORD_RECOVERY_API_PATH } from '@/app/frontend_public/public_auth/auth_password_recovery/config/public_auth_password_recovery_url_config';
import { requirePublicAuthPasswordRecoveryEndpointPath } from '@/app/frontend_public/public_auth/auth_password_recovery/utils/PublicAuthPasswordRecoveryUrlGuard';
import type { PublicAuthPasswordRecoveryApiEnvelope, PublicAuthPasswordRecoveryRequest, PublicAuthPasswordRecoveryValidationError } from '@/app/frontend_public/public_auth/auth_password_recovery/types/PublicAuthPasswordRecoveryApiTypes';

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
export type PublicAuthPasswordRecoveryApiErrorCode = 'CONFIGURATION' | 'CONNECTION' | 'UNEXPECTED_RESPONSE' | 'REQUEST_REJECTED';

/** Localized, user-safe copy supplied by the owning form. */
export interface PublicAuthPasswordRecoveryApiErrorMessages {
  configuration: string;
  connection: string;
  requestFailed: string;
  unexpected: string;
}

/** Typed API failure with filtered field details and no raw transport response. */
export class PublicAuthPasswordRecoveryApiError extends Error {
  readonly validationErrors: readonly PublicAuthPasswordRecoveryValidationError[];

  constructor(message: string, readonly code: PublicAuthPasswordRecoveryApiErrorCode, validationErrors: readonly PublicAuthPasswordRecoveryValidationError[] = []) {
    super(message);
    this.name = 'PublicAuthPasswordRecoveryApiError';
    this.validationErrors = validationErrors.filter(
      (item) => typeof item.field === 'string' && item.field.trim().length > 0
        && typeof item.message === 'string' && item.message.trim().length > 0,
    );
  }
}

/** Map transport failures to localized safe copy; never display raw server messages. */
export function getPublicAuthPasswordRecoveryApiErrorMessage(error: unknown, messages: PublicAuthPasswordRecoveryApiErrorMessages): string {
  if (!(error instanceof PublicAuthPasswordRecoveryApiError)) return messages.unexpected;
  if (error.code === 'CONFIGURATION') return messages.configuration;
  if (error.code === 'CONNECTION') return messages.connection;
  if (error.code === 'UNEXPECTED_RESPONSE') return messages.unexpected;
  if (error.code === 'REQUEST_REJECTED') return messages.requestFailed;
  return messages.unexpected;
}

/** Submits only the observed identity payload to the existing host-configured endpoint. */
export async function requestPublicAuthPasswordRecovery(payload: PublicAuthPasswordRecoveryRequest, idempotencyKey: string): Promise<PublicAuthPasswordRecoveryApiEnvelope> {
  let path: string;
  try {
    path = requirePublicAuthPasswordRecoveryEndpointPath(PUBLIC_AUTH_PASSWORD_RECOVERY_API_PATH);
  } catch {
    throw new PublicAuthPasswordRecoveryApiError('AUTH_ENDPOINT_CONFIGURATION_MISSING', 'CONFIGURATION');
  }

  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    throw new PublicAuthPasswordRecoveryApiError('AUTH_REQUEST_KEY_INVALID', 'UNEXPECTED_RESPONSE');
  }

  let response: Response;
  try {
    response = await apiFetch(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    });
  } catch {
    throw new PublicAuthPasswordRecoveryApiError('AUTH_SERVICE_UNREACHABLE', 'CONNECTION');
  }

  let rawResponse: unknown;
  try {
    rawResponse = await response.json();
  } catch {
    throw new PublicAuthPasswordRecoveryApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const parsedResponse = authApiEnvelopeSchema.safeParse(rawResponse);
  if (!parsedResponse.success) {
    throw new PublicAuthPasswordRecoveryApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const envelope = parsedResponse.data;
  if (!response.ok || !envelope.success) {
    // Preserve field identity for known form controls; server-provided text remains untrusted.
    throw new PublicAuthPasswordRecoveryApiError(
      'AUTH_REQUEST_REJECTED',
      'REQUEST_REJECTED',
      envelope.success ? [] : envelope.validationErrors ?? [],
    );
  }

  return envelope;
}
