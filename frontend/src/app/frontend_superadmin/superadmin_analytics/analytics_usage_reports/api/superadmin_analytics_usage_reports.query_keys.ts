// api/superadmin_analytics_usage_reports.query_keys.ts
// Query key factory for Superadmin Usage Reports

export const SUPERADMIN_USAGE_REPORTS_QUERY_KEYS = {
  all: ['superadmin_usage_reports'] as const,
  overview: (filters?: Record<string, unknown>) => ['superadmin_usage_reports', 'overview', filters] as const,
};
