/** Dedicated TanStack Query key registry for this autonomous submodule. */
export const ADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS = {
  all: ['admin_finance_security_deposits'] as const,
  lists: () => [...ADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_FINANCE_SECURITY_DEPOSITS_QUERY_KEYS.details(), resourceId] as const,
} as const;
