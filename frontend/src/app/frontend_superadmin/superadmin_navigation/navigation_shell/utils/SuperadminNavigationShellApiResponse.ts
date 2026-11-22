// RESPONSIBILITY: Provide deterministic module-owned helper behavior for navigation shell; it does not own page routing or live backend persistence.
// FLOW: Feature caller -> superadmin_navigation/navigation_shell/utils/SuperadminNavigationShellApiResponse.ts -> typed input/contract -> deterministic helper result.
import type {
  ApiFailure,
  ApiResponse,
  PaginationMeta,
  ValidationErrorItem,
} from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/contracts/SuperadminNavigationShellApiResponse';

/** Safe, typed representation of a failed canonical API response. */
export class SuperadminNavigationShellApiFailureError extends Error {
  readonly errorCode: string;
  readonly statusCode: number;
  readonly requestId: string;
  readonly validationErrors?: ValidationErrorItem[];

  /** Keeps gateway diagnostics available without serializing the raw response body. */
  constructor(failure: ApiFailure) {
    super(failure.message);
    this.name = 'SuperadminNavigationShellApiFailureError';
    this.errorCode = failure.errorCode;
    this.statusCode = failure.statusCode;
    this.requestId = failure.requestId;
    this.validationErrors = failure.validationErrors;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPaginationMeta(value: unknown): value is PaginationMeta {
  if (!isRecord(value)) return false;
  const { total, page, limit, totalPages, hasNextPage, hasPrevPage } = value;
  return Number.isInteger(total) && Number(total) >= 0
    && Number.isInteger(page) && Number(page) >= 1
    && Number.isInteger(limit) && Number(limit) >= 1
    && Number.isInteger(totalPages) && Number(totalPages) === Math.ceil(Number(total) / Number(limit))
    && typeof hasNextPage === 'boolean'
    && typeof hasPrevPage === 'boolean';
}

function isValidationErrors(value: unknown): value is ValidationErrorItem[] {
  return Array.isArray(value) && value.every((item) => isRecord(item)
    && typeof item.field === 'string' && item.field.length > 0
    && typeof item.message === 'string' && item.message.length > 0);
}

function isFailure(value: unknown): value is ApiFailure {
  if (!isRecord(value)) return false;
  return value.success === false
    && typeof value.message === 'string'
    && value.data === null
    && typeof value.errorCode === 'string' && value.errorCode.length > 0
    && Number.isInteger(value.statusCode)
    && typeof value.requestId === 'string' && value.requestId.length > 0
    && (value.error === undefined || typeof value.error === 'string')
    && (value.validationErrors === undefined || isValidationErrors(value.validationErrors));
}

/**
 * Validates the canonical gateway envelope, surfaces safe server messages, then parses the success payload.
 * @param response Unknown transport result; no payload shape is assumed before validation.
 * @param parseData Runtime parser for the feature-owned response schema.
 * @returns The runtime-validated feature payload.
 * @throws {SuperadminNavigationShellApiFailureError} When the gateway returns its canonical failure variant.
 * @throws {Error} When the transport result violates the documented envelope.
 
 * @example parseSuperadminNavigationShellApiResponse(response, parseData) uses the declared inputs to produce the module's canonical output.
 */
export function parseSuperadminNavigationShellApiResponse<T>(
  response: unknown,
  parseData: (data: unknown) => T,
): T {
  if (!isRecord(response) || typeof response.success !== 'boolean') {
    throw new Error('API response does not match the documented gateway envelope.');
  }

  if (response.success === false) {
    if (!isFailure(response)) throw new Error('API failure response does not match the documented gateway envelope.');
    throw new SuperadminNavigationShellApiFailureError(response);
  }

  const envelope = response as unknown as ApiResponse<unknown>;
  if (typeof envelope.message !== 'string' || typeof envelope.requestId !== 'string' || envelope.requestId.length === 0 || envelope.data === null || envelope.data === undefined) {
    throw new Error('API success response does not match the documented gateway envelope.');
  }
  if (envelope.meta !== undefined && !isPaginationMeta(envelope.meta)) {
    throw new Error('API pagination metadata does not match the documented gateway envelope.');
  }
  return parseData(envelope.data);
}
