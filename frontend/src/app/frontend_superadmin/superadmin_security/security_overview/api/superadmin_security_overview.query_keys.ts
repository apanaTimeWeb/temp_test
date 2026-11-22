// RESPONSIBILITY: Define the typed API/query boundary for security overview; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_security/security_overview/api/superadmin_security_overview.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * Canonical query-key namespace for the security_overview leaf.
 * @remarks The root key scopes this leaf's server-state cache without asserting an API endpoint or backend contract.
 */
export const SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS = {
  /** Prefix for every query owned by this leaf. */
  all: ['superadmin', 'superadmin_security', 'security_overview'] as const,
  /** Prefix for list queries owned by this leaf. */
  lists: () => [...SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS.all, 'list'] as const,
  /** Key for a list query with typed, serializable filter values. */
  list: (filters: Readonly<Record<string, string | number | boolean | null | undefined>>) => [...SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS.lists(), filters] as const,
  /** Prefix for detail queries owned by this leaf. */
  details: () => [...SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS.all, 'detail'] as const,
  /** Key for a detail query for a stable record identifier. */
  detail: (id: string) => [...SUPERADMIN_SECURITY_OVERVIEW_QUERY_KEYS.details(), id] as const,
} as const;
