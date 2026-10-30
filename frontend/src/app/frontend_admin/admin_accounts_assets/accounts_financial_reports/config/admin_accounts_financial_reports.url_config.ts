/**
 * Canonical UI/API contract for admin_accounts_financial_reports.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_ACCOUNTS_FINANCIAL_REPORTS_ROUTES = {
  ROOT: '/admin/admin_accounts_assets/accounts_financial_reports',
} as const;

export const ADMIN_ACCOUNTS_FINANCIAL_REPORTS_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/accounting',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_ACCOUNTS_FINANCIAL_REPORTS_CANONICAL_ROUTE = ADMIN_ACCOUNTS_FINANCIAL_REPORTS_ROUTES.ROOT;
