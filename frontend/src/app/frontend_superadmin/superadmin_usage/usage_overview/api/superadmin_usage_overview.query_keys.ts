// api/superadmin_usage_overview.query_keys.ts

export const SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS = {
  all: ['superadmin', 'usage', 'overview'] as const,
  lists: () => [...SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.lists(), filters] as const,
  summary: () => [...SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.all, 'summary'] as const,
  details: () => [...SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_USAGE_OVERVIEW_QUERY_KEYS.details(), id] as const,
} as const;
