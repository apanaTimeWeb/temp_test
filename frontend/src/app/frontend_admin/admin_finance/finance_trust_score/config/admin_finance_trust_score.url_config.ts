/**
 * Canonical UI/API contract for admin_finance_trust_score.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_FINANCE_TRUST_SCORE_ROUTES = {
  ROOT: '/admin/admin_finance/finance_trust_score',
} as const;

export const ADMIN_FINANCE_TRUST_SCORE_API = {
  /** No verified feature-specific API endpoint/operation was supplied. */
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_FINANCE_TRUST_SCORE_CANONICAL_ROUTE = ADMIN_FINANCE_TRUST_SCORE_ROUTES.ROOT;
