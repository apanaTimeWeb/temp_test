/** Canonical route configuration owned by manager finance subscriptions. */
const ROOT = '/frontend_manager/manager_finance/finance_subscriptions' as const;

export const MANAGER_FINANCE_SUBSCRIPTIONS_ROUTES = {
  root: ROOT,
  SUBSCRIPTIONS: `${ROOT}?${new URLSearchParams({ view: 'subscriptions' }).toString()}`,
} as const;

export const MANAGER_FINANCE_SUBSCRIPTIONS_API = {
  LIST: '/api/v1/manager/finance/subscriptions' as const,
  DETAIL: (id: string) => `/api/v1/manager/finance/subscriptions/${encodeURIComponent(id)}` as const,
  CANCEL: (id: string) => `/api/v1/manager/finance/subscriptions/${encodeURIComponent(id)}/cancel` as const,
  EXPORT_CSV: '/api/v1/manager/finance/subscriptions/export-csv' as const,
} as const;
