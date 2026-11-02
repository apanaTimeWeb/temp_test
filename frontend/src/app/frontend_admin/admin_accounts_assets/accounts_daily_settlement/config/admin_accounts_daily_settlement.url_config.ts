// config/admin_accounts_daily_settlement.url_config.ts
// Owned by: admin/admin_accounts_assets/accounts_daily_settlement autonomous sub-module
// Centralized typed routes and backend API endpoints

export const ADMIN_ACCOUNTS_DAILY_SETTLEMENT_ROUTES = {
  root: '/admin/admin_accounts_assets/accounts_daily_settlement' as const,
  detail: (id: string) => `/admin/admin_accounts_assets/accounts_daily_settlement?view=detail&id=${encodeURIComponent(id)}` as const,
} as const;

export const ADMIN_ACCOUNTS_DAILY_SETTLEMENT_API = {
  list: '/api/v1/admin/accounts/daily-settlements' as const,
  detail: (id: string) => `/api/v1/admin/accounts/daily-settlements/${encodeURIComponent(id)}` as const,
  approve: (id: string) => `/api/v1/admin/accounts/daily-settlements/${encodeURIComponent(id)}/approve` as const,
  flagDiscrepancy: (id: string) => `/api/v1/admin/accounts/daily-settlements/${encodeURIComponent(id)}/flag-discrepancy` as const,
  kpis: '/api/v1/admin/accounts/daily-settlements/kpis' as const,
} as const;

