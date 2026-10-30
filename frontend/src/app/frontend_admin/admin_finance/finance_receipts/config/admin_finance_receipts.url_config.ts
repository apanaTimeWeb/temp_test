/** Canonical browser routes for the receipt list and existing query-driven detail view. */
export const ADMIN_FINANCE_RECEIPTS_ROUTES = {
  ROOT: '/admin/admin_finance/finance_receipts',
  DETAIL: (id: string | number) => `/admin/admin_finance/finance_receipts?view=detail&id=${encodeURIComponent(String(id))}`,
} as const;

/** The current receipt feature uses source-local demo fixtures; no live receipt API contract is verified. */
export const ADMIN_FINANCE_RECEIPTS_API = {} as const;
