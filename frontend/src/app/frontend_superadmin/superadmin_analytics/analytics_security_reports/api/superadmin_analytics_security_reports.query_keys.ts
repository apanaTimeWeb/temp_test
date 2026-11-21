// api/superadmin_analytics_security_reports.query_keys.ts
// Query key factory for Superadmin Security Reports

export const SUPERADMIN_SECURITY_REPORTS_QUERY_KEYS = {
  all: ['superadmin_security_reports'] as const,
  overview: (filters?: Record<string, unknown>) => ['superadmin_security_reports', 'overview', filters] as const,
};
