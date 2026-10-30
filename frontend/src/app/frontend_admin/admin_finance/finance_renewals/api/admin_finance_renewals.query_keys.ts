/** Dedicated query-key registry for this autonomous submodule. */

/** Feature-scoped TanStack Query keys for admin_renewals. Keep server-state cache ownership inside this feature. */
export const ADMIN_RENEWALS_QUERY_KEYS = {
  all: ['admin_renewals'] as const,
  lists: () => [...ADMIN_RENEWALS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_RENEWALS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_RENEWALS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_RENEWALS_QUERY_KEYS.details(), resourceId] as const,
} as const;
