/**
 * Canonical UI/API contract for admin_finance_late_fees.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_FINANCE_LATE_FEES_ROUTES = {
  ROOT: '/admin/admin_finance/finance_late_fees',
} as const;

export const ADMIN_FINANCE_LATE_FEES_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_FINANCE_LATE_FEES_CANONICAL_ROUTE = ADMIN_FINANCE_LATE_FEES_ROUTES.ROOT;
