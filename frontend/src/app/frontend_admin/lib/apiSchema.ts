import { z } from 'zod';

/** Canonical transport envelope from the web frontend API contract (Architecture Rule 59). */
export const PaginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const ValidationErrorItemSchema = z.object({
  field: z.string(),
  message: z.string(),
});

const ApiSuccessEnvelopeSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.unknown(),
  meta: PaginationMetaSchema.optional(),
  requestId: z.string().min(1),
}).passthrough();

const ApiFailureEnvelopeSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  data: z.null(),
  error: z.string().optional(),
  errorCode: z.string().min(1),
  statusCode: z.number().int(),
  requestId: z.string().min(1),
  validationErrors: z.array(ValidationErrorItemSchema).optional(),
}).passthrough();

/** Canonical discriminated transport envelope shared by every feature API client. */
export const ApiResponseEnvelopeSchema = z.discriminatedUnion('success', [
  ApiSuccessEnvelopeSchema,
  ApiFailureEnvelopeSchema,
]);

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  requestId: string;
};

export type ApiFailure = {
  success: false;
  message: string;
  data: null;
  error?: string;
  errorCode: string;
  statusCode: number;
  requestId: string;
  validationErrors?: ValidationErrorItem[];
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export class ApiResponseError extends Error {
  readonly errorCode?: string;
  readonly statusCode?: number;
  readonly requestId?: string;
  readonly validationErrors?: ValidationErrorItem[];

  constructor(message: string, options: { errorCode?: string; statusCode?: number; requestId?: string; validationErrors?: ValidationErrorItem[] } = {}) {
    super(message);
    this.name = 'ApiResponseError';
    this.errorCode = options.errorCode;
    this.statusCode = options.statusCode;
    this.requestId = options.requestId;
    this.validationErrors = options.validationErrors;
  }
}

/** Normalize malformed or blank API error text into a stable actionable message. */
export function nonEmptyApiMessage(message: unknown, statusCode?: number, errorCode?: string): string {
  if (typeof message === 'string' && message.trim()) return message.trim();
  if (typeof errorCode === 'string' && errorCode.trim()) return `Request failed (${errorCode.trim()}).`;
  if (typeof statusCode === 'number' && Number.isFinite(statusCode)) return `Request failed with status ${statusCode}.`;
  return 'The request could not be completed.';
}

/**
 * Validates the mandatory envelope before validating its feature-owned `data` payload.
 * List/detail readers should use the owning module's Zod schema as `dataSchema`.
 * A successful null payload is rejected when the caller requires a concrete payload.
 */
export function parseApiResponseData<T>(payload: unknown, dataSchema: z.ZodType<T>): T {
  const envelope = ApiResponseEnvelopeSchema.parse(payload);
  if (!envelope.success) {
    throw new ApiResponseError(nonEmptyApiMessage(envelope.message, envelope.statusCode, envelope.errorCode ?? envelope.error), {
      errorCode: envelope.errorCode ?? envelope.error,
      statusCode: envelope.statusCode,
      requestId: envelope.requestId,
      validationErrors: envelope.validationErrors,
    });
  }
  if (envelope.data === null) {
    throw new ApiResponseError(typeof envelope.message === 'string' && envelope.message.trim() ? envelope.message.trim() : 'The API returned no data for a successful response.', {
      requestId: envelope.requestId,
    });
  }
  return dataSchema.parse(envelope.data);
}
