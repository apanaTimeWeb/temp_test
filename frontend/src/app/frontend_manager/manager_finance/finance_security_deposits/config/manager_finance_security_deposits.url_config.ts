/** Canonical route configuration owned by manager finance security deposits. */
const ROOT = '/frontend_manager/manager_finance/finance_security_deposits' as const;

export const MANAGER_FINANCE_SECURITY_DEPOSITS_ROUTES = {
  root: ROOT,
  SECURITY_DEPOSITS: `${ROOT}?${new URLSearchParams({ view: 'security_deposits' }).toString()}`,
} as const;

export const MANAGER_FINANCE_SECURITY_DEPOSITS_API = {
  LIST: '/api/v1/manager/finance/security-deposits' as const,
  REFUND: (id: string) => `/api/v1/manager/finance/security-deposits/${encodeURIComponent(id)}/refund` as const,
  DEDUCT: (id: string) => `/api/v1/manager/finance/security-deposits/${encodeURIComponent(id)}/deduct` as const,
  EXPORT_CSV: '/api/v1/manager/finance/security-deposits/export-csv' as const,
} as const;
