/** Dedicated query-key registry for this autonomous submodule. */

/** Query keys owned by the admin_finance_refunds submodule. */
export const ADMIN_FINANCE_REFUNDS_QUERY_KEYS = {
  all: ['admin_finance_refunds'] as const,
  lists: () => [...ADMIN_FINANCE_REFUNDS_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: Readonly<Record<string, string | number | boolean | undefined>>) =>
    [...ADMIN_FINANCE_REFUNDS_QUERY_KEYS.lists(), filters ?? {}] as const,
  details: () => [...ADMIN_FINANCE_REFUNDS_QUERY_KEYS.all, 'detail'] as const,
  detail: (resourceId: string) => [...ADMIN_FINANCE_REFUNDS_QUERY_KEYS.details(), resourceId] as const,
} as const;
