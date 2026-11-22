// api/superadmin_analytics_platform_reports.query_keys.ts
// TanStack Query Key factory for Platform Reports

export const SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS = {
  all: ['superadmin_platform_reports'] as const,
  overview: (filters: Record<string, unknown>) =>
    [...SUPERADMIN_PLATFORM_REPORTS_QUERY_KEYS.all, 'overview', filters] as const,
};
