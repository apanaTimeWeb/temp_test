

/**
 * Canonical UI/API contract for admin_accounts_shift_gap_analyzer.
 * UI routes are source-verified; API operations remain explicitly unverified unless stated below.
 */
export const ADMIN_ACCOUNTS_SHIFT_GAP_ANALYZER_ROUTES = {
  ROOT: '/admin/admin_accounts_assets/accounts_shift_gap_analyzer',
} as const;

export const ADMIN_ACCOUNTS_SHIFT_GAP_ANALYZER_API = {
  /** Source-observed domain API base only; feature operations and response DTOs remain CONTRACT_MISSING. */
  BASE_PATH: '/api/v1/admin/accounting',
  CONTRACT_MISSING: null as string | null,
} as const;

/** Preserves the existing canonical route export without creating a re-export facade. */
export const ADMIN_ACCOUNTS_SHIFT_GAP_ANALYZER_CANONICAL_ROUTE = ADMIN_ACCOUNTS_SHIFT_GAP_ANALYZER_ROUTES.ROOT;

export const ADMIN_ACCOUNTING_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;
export const ADMIN_ACCOUNTING_DEFAULT_PAGE_SIZE = 25 as const;

export const ADMIN_ACCOUNTING_EXPENSE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Miscellaneous', 'Rent', 'Salary',
] as const;
export const ADMIN_ACCOUNTING_EXPENSE_MODE_BADGE = {
  cash: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-cash-bg text-pay-cash border-border',
  upi: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-upi-bg text-pay-upi border-border',
  card: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-card-bg text-pay-card border-border',
  bank: 'inline-flex min-h-6 items-center gap-1 rounded-full border border-transparent px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap bg-pay-bank-bg text-pay-bank border-border',
} as const;

export const ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS = ['primary', 'success', 'warning', 'danger', 'info', 'purple'] as const;
export type AdminAccountingExpenseCategoryColor = (typeof ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS)[number];

/** Valid filter values shared only by this Accounting feature's shift-gap views. */
export const ADMIN_ACCOUNTING_SHIFT_FILTER_OPTIONS = ['all', 'Morning', 'Afternoon', 'Night', '24-Hour'] as const;
export const ADMIN_ACCOUNTING_SEAT_GAP_STATUS_FILTER_OPTIONS = ['all', 'vacant', 'maintenance'] as const;
