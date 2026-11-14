// RESPONSIBILITY: Define the typed API/query boundary for subscriptions member renewals; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_subscriptions/subscriptions_member_renewals/api/superadmin_subscriptions_overview_member_renewals.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS = {
  all: ['superadmin_member_renewals'] as const,
  lists: () => [...SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_FINANCE_RENEWALS_QUERY_KEYS.details(), id] as const,
};
