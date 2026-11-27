

/**
 * Canonical UI/API contract for admin_accounts_seat_gap_report.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_ACCOUNTS_SEAT_GAP_REPORT_ROUTES = {
  ROOT: '/admin/admin_accounts_assets/accounts_seat_gap_report',
} as const;

export const ADMIN_ACCOUNTS_SEAT_GAP_REPORT_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/accounting',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_ACCOUNTS_SEAT_GAP_REPORT_CANONICAL_ROUTE = ADMIN_ACCOUNTS_SEAT_GAP_REPORT_ROUTES.ROOT;

/** Valid filter values shared only by this Accounting feature's shift-gap views. */
export const ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS = ['all', 'Morning', 'Afternoon', 'Night', '24-Hour'] as const;
export const ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS = ['all', 'vacant', 'maintenance'] as const;
