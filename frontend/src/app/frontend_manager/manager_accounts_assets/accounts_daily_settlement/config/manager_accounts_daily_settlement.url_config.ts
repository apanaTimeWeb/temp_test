/** Canonical route configuration owned by manager accounts_daily_settlement. */
const ROOT = '/frontend_manager/manager_accounts_assets/accounts_daily_settlement' as const;

export const MANAGER_ACCOUNTS_DAILY_SETTLEMENT_ROUTES = { root: ROOT } as const;

export const MANAGER_ACCOUNTS_DAILY_SETTLEMENT_API = {
  LIST: '/api/v1/manager/accounts/daily-settlements' as const,
  SETTLE: (shift: string) => `/api/v1/manager/accounts/daily-settlements/${encodeURIComponent(shift)}/settle` as const,
  KPIS: '/api/v1/manager/accounts/daily-settlements/kpis' as const,
  EXPORT_CSV: '/api/v1/manager/accounts/daily-settlements/export-csv' as const,
} as const;
