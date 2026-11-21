// config/superadmin_analytics_security_reports.url_config.ts
// Canonical URL and API endpoint configuration for Superadmin Security Reports

export const SUPERADMIN_ANALYTICS_SECURITY_REPORTS_ROUTES = {
  root: '/superadmin/superadmin_analytics/analytics_security_reports' as const,
  platformReports: '/superadmin/superadmin_analytics/analytics_platform_reports' as const,
  billingReports: '/superadmin/superadmin_analytics/analytics_billing_reports' as const,
  usageReports: '/superadmin/superadmin_analytics/analytics_usage_reports' as const,
} as const;

export const SUPERADMIN_ANALYTICS_SECURITY_REPORTS_API = {
  getOverview: '/api/v1/superadmin/analytics/security-reports/overview' as const,
  exportReport: '/api/v1/superadmin/analytics/security-reports/export' as const,
} as const;
