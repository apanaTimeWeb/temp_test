/** Canonical browser routes consumed by the payments UI. Cross-domain leaf destinations are source-observed; no sibling module is imported. */
export const ADMIN_FINANCE_PAYMENTS_ROUTES = {
  ROOT: '/admin/admin_finance/finance_payments',
  INVOICE: (id: string | number) => `/admin/admin_finance/finance_invoices?view=detail&id=${encodeURIComponent(String(id))}`,
  RECEIPT: (id: string | number) => `/admin/admin_finance/finance_receipts?view=detail&id=${encodeURIComponent(String(id))}`,
} as const;

/** API paths are the exact endpoints already used by the module-owned API adapter. */
export const ADMIN_FINANCE_PAYMENTS_API = {
  LIST: '/finance/payments',
} as const;
