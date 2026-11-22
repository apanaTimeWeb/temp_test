/** Canonical browser route for the refunds ledger. */
export const ADMIN_FINANCE_REFUNDS_ROUTES = {
  ROOT: '/admin/admin_finance/finance_refunds',
} as const;

/** Exact existing API endpoint used by the module-owned API adapter. */
export const ADMIN_FINANCE_REFUNDS_API = {
  LIST: '/finance/refunds',
} as const;
