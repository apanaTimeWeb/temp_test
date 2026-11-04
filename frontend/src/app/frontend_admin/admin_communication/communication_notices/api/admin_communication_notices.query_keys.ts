/** Dedicated query-key registry for this autonomous submodule. */

/** Feature-scoped TanStack Query keys for admin_communication. Keep server-state cache ownership inside this feature. */
export const ADMIN_COMMUNICATION_QUERY_KEYS = {
  all: ['admin_communication_notices'] as const,
  lists: () => [...ADMIN_COMMUNICATION_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_COMMUNICATION_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_COMMUNICATION_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_COMMUNICATION_QUERY_KEYS.details(), resourceId] as const,
} as const;
