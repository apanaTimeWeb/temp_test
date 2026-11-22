/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_ACCOUNTS_SEAT_GAP_REPORT_QUERY_KEYS = {
  all: ['admin_accounts_seat_gap_report'] as const,
  lists: () => [...ADMIN_ACCOUNTS_SEAT_GAP_REPORT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_ACCOUNTS_SEAT_GAP_REPORT_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_ACCOUNTS_SEAT_GAP_REPORT_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_ACCOUNTS_SEAT_GAP_REPORT_QUERY_KEYS.details(), resourceId] as const,
} as const;
