// RESPONSIBILITY: Define the typed API/query boundary for subscriptions active subscribers; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_subscriptions/subscriptions_active_subscribers/api/superadmin_subscriptions_active_subscribers.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * Canonical query-key namespace for the subscriptions_active_subscribers leaf.
 * @remarks The root key scopes this leaf's server-state cache without asserting an API endpoint or backend contract.
 */
export const SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS = {
  /** Prefix for every query owned by this leaf. */
  all: ['superadmin', 'superadmin_subscriptions', 'subscriptions_active_subscribers'] as const,
  /** Prefix for list queries owned by this leaf. */
  lists: () => [...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.all, 'list'] as const,
  /** Key for a list query with typed, serializable filter values. */
  list: (filters: Readonly<Record<string, string | number | boolean | null | undefined>>) => [...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.lists(), filters] as const,
  /** Prefix for detail queries owned by this leaf. */
  details: () => [...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.all, 'detail'] as const,
  /** Key for a detail query for a stable record identifier. */
  detail: (id: string) => [...SUPERADMIN_SUBSCRIPTIONS_ACTIVE_SUBSCRIBERS_QUERY_KEYS.details(), id] as const,
} as const;
