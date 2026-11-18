/** Canonical route configuration owned by admin finance auto suspend. */
const ROOT = '/admin/admin_finance/finance_auto_suspend' as const;

export const ADMIN_FINANCE_AUTO_SUSPEND_ROUTES = {
  root: ROOT,
  AUTO_SUSPEND: ROOT,
} as const;

export const ADMIN_FINANCE_AUTO_SUSPEND_API = {
  LIST: '/api/v1/admin/finance/auto-suspend' as const,
  SUSPEND: (id: string) => `/api/v1/admin/finance/auto-suspend/${encodeURIComponent(id)}/suspend` as const,
  REINSTATE: (id: string) => `/api/v1/admin/finance/auto-suspend/${encodeURIComponent(id)}/reinstate` as const,
  EXPORT_CSV: '/api/v1/admin/finance/auto-suspend/export-csv' as const,
} as const;
