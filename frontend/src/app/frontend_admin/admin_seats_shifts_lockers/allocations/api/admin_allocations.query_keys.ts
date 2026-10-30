/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_ALLOCATIONS_QUERY_KEYS = {
  all: ['admin_allocations'] as const,
  lists: () => [...ADMIN_ALLOCATIONS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_ALLOCATIONS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_ALLOCATIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_ALLOCATIONS_QUERY_KEYS.details(), resourceId] as const,
} as const;
