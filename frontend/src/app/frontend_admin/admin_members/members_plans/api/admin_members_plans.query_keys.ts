/** Dedicated query-key registry for this autonomous submodule. */

export const ADMIN_PLANS_QUERY_KEYS = {
  all: ['admin_plans'] as const,
  lists: () => [...ADMIN_PLANS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_PLANS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_PLANS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_PLANS_QUERY_KEYS.details(), resourceId] as const,
} as const;
