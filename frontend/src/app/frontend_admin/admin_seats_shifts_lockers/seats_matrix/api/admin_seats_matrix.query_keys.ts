/** Dedicated query-key registry for this autonomous submodule. */

export const ADMIN_SEAT_MATRIX_QUERY_KEYS = {
  all: ['admin_seat_matrix'] as const,
  lists: () => [...ADMIN_SEAT_MATRIX_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_SEAT_MATRIX_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_SEAT_MATRIX_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_SEAT_MATRIX_QUERY_KEYS.details(), resourceId] as const,
} as const;
