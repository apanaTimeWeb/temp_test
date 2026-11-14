// RESPONSIBILITY: Declare host boundary contracts for billing member payments; ambient stubs provide no runtime implementation or authorization.
// FLOW: TypeScript/static validation -> superadmin_billing/billing_member_payments/contracts/SuperadminBillingMemberPaymentsApiResponse.ts -> compile-time host boundary -> feature source.
/**
 * Portable, leaf-owned declaration of the canonical API gateway envelope.
 * Keep field names and discriminated-union semantics aligned with the supplied architecture contract.
 */
export interface ValidationErrorItem {
  /** Exact DTO field name, using dot notation for nested fields. */
  field: string;
  /** Human-readable field validation message. */
  message: string;
}

/** Pagination metadata for a successful paginated API response. */
export interface PaginationMeta {
  /** Total records matching the request query. */
  total: number;
  /** One-based current page. */
  page: number;
  /** Requested page size. */
  limit: number;
  /** Total pages, equal to Math.ceil(total / limit). */
  totalPages: number;
  /** Whether a following page exists. */
  hasNextPage: boolean;
  /** Whether a preceding page exists. */
  hasPrevPage: boolean;
}

/** Successful API response; payload data is guaranteed to be non-null. */
export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
  requestId: string;
}

/** Failed API response; payload is explicitly null and carries stable diagnostics. */
export interface ApiFailure {
  success: false;
  message: string;
  data: null;
  error?: string;
  errorCode: string;
  statusCode: number;
  requestId: string;
  validationErrors?: ValidationErrorItem[];
}

/** Canonical discriminated union for API gateway responses consumed by this leaf. */
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
