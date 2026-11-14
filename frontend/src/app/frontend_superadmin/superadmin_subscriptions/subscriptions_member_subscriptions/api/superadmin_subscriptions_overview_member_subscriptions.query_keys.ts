// RESPONSIBILITY: Define the typed API/query boundary for subscriptions member subscriptions; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_subscriptions/subscriptions_member_subscriptions/api/superadmin_subscriptions_overview_member_subscriptions.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS = {
  all: ['superadmin_member_subscriptions'] as const,
  lists: () => [...SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_FINANCE_SUBSCRIPTIONS_QUERY_KEYS.details(), id] as const,
};
