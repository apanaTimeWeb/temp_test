/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_SHIFTS_MANAGEMENT_QUERY_KEYS = {
  all: ['admin_shifts_management'] as const,
  lists: () => [...ADMIN_SHIFTS_MANAGEMENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_SHIFTS_MANAGEMENT_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_SHIFTS_MANAGEMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_SHIFTS_MANAGEMENT_QUERY_KEYS.details(), resourceId] as const,
} as const;
