/** Canonical route configuration owned by admin finance security deposits. */
const ROOT = '/admin/admin_finance/finance_security_deposits' as const;

export const ADMIN_FINANCE_SECURITY_DEPOSITS_ROUTES = {
  root: ROOT,
  SECURITY_DEPOSITS: ROOT,
} as const;

export const ADMIN_FINANCE_SECURITY_DEPOSITS_API = {
  LIST: '/api/v1/admin/finance/security-deposits' as const,
  REFUND: (id: string | number) => `/api/v1/admin/finance/security-deposits/${encodeURIComponent(id)}/refund` as const,
  DEDUCT: (id: string | number) => `/api/v1/admin/finance/security-deposits/${encodeURIComponent(id)}/deduct` as const,
  EXPORT_CSV: '/api/v1/admin/finance/security-deposits/export-csv' as const,
} as const;
