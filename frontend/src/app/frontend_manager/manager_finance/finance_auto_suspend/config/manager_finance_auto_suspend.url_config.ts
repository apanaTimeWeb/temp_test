/** Canonical route configuration owned by manager finance auto suspend. */
const ROOT = '/frontend_manager/manager_finance/finance_auto_suspend' as const;

export const MANAGER_FINANCE_AUTO_SUSPEND_ROUTES = {
  root: ROOT,
  AUTO_SUSPEND: `${ROOT}?${new URLSearchParams({ view: 'auto_suspend' }).toString()}`,
} as const;

export const MANAGER_FINANCE_AUTO_SUSPEND_API = {
  LIST: '/api/v1/manager/finance/auto-suspend' as const,
  SUSPEND: (id: string) => `/api/v1/manager/finance/auto-suspend/${encodeURIComponent(id)}/suspend` as const,
  REINSTATE: (id: string) => `/api/v1/manager/finance/auto-suspend/${encodeURIComponent(id)}/reinstate` as const,
  EXPORT_CSV: '/api/v1/manager/finance/auto-suspend/export-csv' as const,
} as const;
