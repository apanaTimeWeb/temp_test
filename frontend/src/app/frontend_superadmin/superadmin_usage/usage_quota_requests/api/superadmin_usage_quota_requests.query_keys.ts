// api/superadmin_usage_quota_requests.query_keys.ts
export const SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS = {
  all: ['superadmin', 'usage', 'quota-requests'] as const,
  list: (filters: { search?: string; status?: string; resourceType?: string }) =>
    [...SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.all, 'list', filters] as const,
  kpis: () => [...SUPERADMIN_USAGE_QUOTA_REQUESTS_QUERY_KEYS.all, 'kpis'] as const,
};
