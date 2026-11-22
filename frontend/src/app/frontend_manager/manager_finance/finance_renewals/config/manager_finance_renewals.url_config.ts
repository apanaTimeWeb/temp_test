/** Canonical route configuration owned by manager finance renewals. */
const ROOT = '/frontend_manager/manager_finance/finance_renewals' as const;

export const MANAGER_FINANCE_RENEWALS_ROUTES = {
  root: ROOT,
  RENEWALS: `${ROOT}?${new URLSearchParams({ view: 'renewals' }).toString()}`,
} as const;

export const MANAGER_FINANCE_RENEWALS_API = {
  LIST: '/api/v1/manager/finance/renewals' as const,
  RENEW: (id: string) => `/api/v1/manager/finance/renewals/${encodeURIComponent(id)}/renew` as const,
  SEND_REMINDER: (id: string) => `/api/v1/manager/finance/renewals/${encodeURIComponent(id)}/reminder` as const,
  EXPORT_CSV: '/api/v1/manager/finance/renewals/export-csv' as const,
} as const;
