/**
 * Dedicated TanStack Query key registry for this autonomous submodule.
 *
 * This declaration reserves a namespaced cache-key shape only. It does not assert that a
 * live query, endpoint, response DTO, or cache invalidation flow is implemented. Introduce
 * consumers only after a verified module API/query contract exists.
 */
export const ADMIN_SHIFTS_MIGRATION_QUERY_KEYS = {
  all: ['admin_shifts_migration'] as const,
  lists: () => [...ADMIN_SHIFTS_MIGRATION_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_SHIFTS_MIGRATION_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_SHIFTS_MIGRATION_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_SHIFTS_MIGRATION_QUERY_KEYS.details(), resourceId] as const,
} as const;
