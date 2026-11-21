// config/superadmin_analytics_usage_reports.url_config.ts
// Canonical URL and API endpoint configuration for Superadmin Usage Reports

export const SUPERADMIN_ANALYTICS_USAGE_REPORTS_ROUTES = {
  root: '/superadmin/superadmin_analytics/analytics_usage_reports' as const,
  platformReports: '/superadmin/superadmin_analytics/analytics_platform_reports' as const,
  billingReports: '/superadmin/superadmin_analytics/analytics_billing_reports' as const,
  securityReports: '/superadmin/superadmin_analytics/analytics_security_reports' as const,
} as const;

export const SUPERADMIN_ANALYTICS_USAGE_REPORTS_API = {
  getOverview: '/api/v1/superadmin/analytics/usage-reports/overview' as const,
  exportReport: '/api/v1/superadmin/analytics/usage-reports/export' as const,
} as const;
