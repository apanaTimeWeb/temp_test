/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_SEATS_HISTORY_QUERY_KEYS = {
  all: ['admin_seats_history'] as const,
  lists: () => [...ADMIN_SEATS_HISTORY_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_SEATS_HISTORY_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_SEATS_HISTORY_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_SEATS_HISTORY_QUERY_KEYS.details(), resourceId] as const,
} as const;
