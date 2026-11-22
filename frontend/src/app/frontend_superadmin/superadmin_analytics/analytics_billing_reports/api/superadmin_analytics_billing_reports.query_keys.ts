// api/superadmin_analytics_billing_reports.query_keys.ts
// TanStack Query Key factory for Billing Reports

export const SUPERADMIN_BILLING_REPORTS_QUERY_KEYS = {
  all: ['superadmin_billing_reports'] as const,
  overview: (filters: Record<string, unknown>) =>
    [...SUPERADMIN_BILLING_REPORTS_QUERY_KEYS.all, 'overview', filters] as const,
};
