/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS = {
  all: ['admin_navigation_sidebar'] as const,
  lists: () => [...ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_NAVIGATION_SIDEBAR_QUERY_KEYS.details(), resourceId] as const,
} as const;
