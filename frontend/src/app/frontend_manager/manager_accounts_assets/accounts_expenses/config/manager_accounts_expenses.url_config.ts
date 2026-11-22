/** Canonical route configuration owned by manager accounts_expenses. */
const ROOT = '/frontend_manager/manager_accounts_assets/accounts_expenses' as const;

export const MANAGER_ACCOUNTS_EXPENSES_ROUTES = { root: ROOT } as const;

export const MANAGER_ACCOUNTS_EXPENSES_API = {
  LIST: '/api/v1/manager/accounts/expenses' as const,
  CREATE: '/api/v1/manager/accounts/expenses' as const,
  DELETE: (id: string) => `/api/v1/manager/accounts/expenses/${encodeURIComponent(id)}` as const,
  EXPORT_CSV: '/api/v1/manager/accounts/expenses/export-csv' as const,
} as const;
