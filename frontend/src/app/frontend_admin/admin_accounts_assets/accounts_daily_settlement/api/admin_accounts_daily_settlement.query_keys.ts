/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS = {
  all: ['admin_accounts_daily_settlement'] as const,
  lists: () => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_ACCOUNTS_DAILY_SETTLEMENT_QUERY_KEYS.details(), resourceId] as const,
} as const;
