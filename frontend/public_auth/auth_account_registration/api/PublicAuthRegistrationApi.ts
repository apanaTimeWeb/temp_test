import { z } from 'zod';
import { apiFetch } from '@/lib/api';
import { PUBLIC_AUTH_REGISTRATION_API_PATH } from '../config/public_auth_registration_url_config';
import { requirePublicAuthRegistrationEndpointPath } from '../utils/PublicAuthRegistrationUrlGuard';
import type { PublicAuthRegistrationApiEnvelope, PublicAuthRegistrationRequest, PublicAuthRegistrationValidationError } from '../types/PublicAuthRegistrationApiTypes';

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
export type PublicAuthRegistrationApiErrorCode = 'CONFIGURATION' | 'CONNECTION' | 'UNEXPECTED_RESPONSE' | 'REQUEST_REJECTED';

/** Localized, user-safe copy supplied by the owning form. */
export interface PublicAuthRegistrationApiErrorMessages {
  configuration: string;
  connection: string;
  requestFailed: string;
  unexpected: string;
}

/** Typed API failure with filtered field details and no raw transport response. */
export class PublicAuthRegistrationApiError extends Error {
  readonly validationErrors: readonly PublicAuthRegistrationValidationError[];

  constructor(message: string, readonly code: PublicAuthRegistrationApiErrorCode, validationErrors: readonly PublicAuthRegistrationValidationError[] = []) {
    super(message);
    this.name = 'PublicAuthRegistrationApiError';
    this.validationErrors = validationErrors.filter(
      (item) => typeof item.field === 'string' && item.field.trim().length > 0
        && typeof item.message === 'string' && item.message.trim().length > 0,
    );
  }
}

/** Map transport failures to localized safe copy; never display raw server messages. */
export function getPublicAuthRegistrationApiErrorMessage(error: unknown, messages: PublicAuthRegistrationApiErrorMessages): string {
  if (!(error instanceof PublicAuthRegistrationApiError)) return messages.unexpected;
  if (error.code === 'CONFIGURATION') return messages.configuration;
  if (error.code === 'CONNECTION') return messages.connection;
  if (error.code === 'UNEXPECTED_RESPONSE') return messages.unexpected;
  if (error.code === 'REQUEST_REJECTED') return messages.requestFailed;
  return messages.unexpected;
}

/** Submits the observed registration payload with its existing idempotency key. */
export async function createPublicAuthRegistration(payload: PublicAuthRegistrationRequest, idempotencyKey: string): Promise<PublicAuthRegistrationApiEnvelope> {
  let path: string;
  try {
    path = requirePublicAuthRegistrationEndpointPath(PUBLIC_AUTH_REGISTRATION_API_PATH);
  } catch {
    throw new PublicAuthRegistrationApiError('AUTH_ENDPOINT_CONFIGURATION_MISSING', 'CONFIGURATION');
  }

  if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
    throw new PublicAuthRegistrationApiError('AUTH_REQUEST_KEY_INVALID', 'UNEXPECTED_RESPONSE');
  }

  let response: Response;
  try {
    response = await apiFetch(path, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey },
    });
  } catch {
    throw new PublicAuthRegistrationApiError('AUTH_SERVICE_UNREACHABLE', 'CONNECTION');
  }

  let rawResponse: unknown;
  try {
    rawResponse = await response.json();
  } catch {
    throw new PublicAuthRegistrationApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const parsedResponse = authApiEnvelopeSchema.safeParse(rawResponse);
  if (!parsedResponse.success) {
    throw new PublicAuthRegistrationApiError('AUTH_RESPONSE_INVALID', 'UNEXPECTED_RESPONSE');
  }

  const envelope = parsedResponse.data;
  if (!response.ok || !envelope.success) {
    // Preserve field identity for known form controls; server-provided text remains untrusted.
    throw new PublicAuthRegistrationApiError(
      'AUTH_REQUEST_REJECTED',
      'REQUEST_REJECTED',
      envelope.success ? [] : envelope.validationErrors ?? [],
    );
  }

  return envelope;
}
