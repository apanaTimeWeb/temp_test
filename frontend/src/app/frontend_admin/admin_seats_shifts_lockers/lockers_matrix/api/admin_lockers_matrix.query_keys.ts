/**
 * Dedicated TanStack Query key registry for this autonomous submodule.
 * This declaration reserves a namespaced key shape; it does not imply a live query is wired.
 */
export const ADMIN_LOCKERS_MATRIX_QUERY_KEYS = {
  all: ['admin_lockers_matrix'] as const,
  lists: () => [...ADMIN_LOCKERS_MATRIX_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_LOCKERS_MATRIX_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_LOCKERS_MATRIX_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_LOCKERS_MATRIX_QUERY_KEYS.details(), resourceId] as const,
} as const;
