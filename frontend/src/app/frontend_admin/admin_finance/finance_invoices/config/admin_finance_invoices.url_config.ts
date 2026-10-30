/** Canonical browser routes for the invoice list and the existing query-driven detail view. */
export const ADMIN_FINANCE_INVOICES_ROUTES = {
  ROOT: '/admin/admin_finance/finance_invoices',
  DETAIL: (id: string | number) => `/admin/admin_finance/finance_invoices?view=detail&id=${encodeURIComponent(String(id))}`,
} as const;

/** The current invoice feature uses source-local demo fixtures; no live invoice API contract is verified. */
export const ADMIN_FINANCE_INVOICES_API = {} as const;
