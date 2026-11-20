// config/superadmin_analytics_platform_reports.url_config.ts
// Centralized URL contracts for Superadmin Platform Reports

export const SUPERADMIN_ANALYTICS_PLATFORM_REPORTS_ROUTES = {
  root: '/superadmin/superadmin_analytics/analytics_platform_reports' as const,
} as const;

export const SUPERADMIN_ANALYTICS_PLATFORM_REPORTS_API = {
  getOverview: '/api/v1/superadmin/analytics/platform-reports' as const,
  exportReport: '/api/v1/superadmin/analytics/platform-reports/export' as const,
} as const;
