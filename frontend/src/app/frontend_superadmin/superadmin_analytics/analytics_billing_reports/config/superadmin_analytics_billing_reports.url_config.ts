// config/superadmin_analytics_billing_reports.url_config.ts
// Centralized URL contracts for Superadmin Billing Reports

export const SUPERADMIN_ANALYTICS_BILLING_REPORTS_ROUTES = {
  root: '/superadmin/superadmin_analytics/analytics_billing_reports' as const,
} as const;

export const SUPERADMIN_ANALYTICS_BILLING_REPORTS_API = {
  getOverview: '/api/v1/superadmin/analytics/billing-reports' as const,
  exportReport: '/api/v1/superadmin/analytics/billing-reports/export' as const,
} as const;
