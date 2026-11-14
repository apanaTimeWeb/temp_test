// RESPONSIBILITY: Define the typed API/query boundary for users roles permissions; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_users/users_roles_permissions/api/superadmin_users_roles_permissions.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/**
 * Canonical query-key namespace for the users_roles_permissions leaf.
 * @remarks The root key scopes this leaf's server-state cache without asserting an API endpoint or backend contract.
 */
export const SUPERADMIN_USERS_ROLES_PERMISSIONS_QUERY_KEYS = {
  /** Prefix for every query owned by this leaf. */
  all: ['superadmin', 'superadmin_users', 'users_roles_permissions'] as const,
  /** Prefix for list queries owned by this leaf. */
  lists: () => [...SUPERADMIN_USERS_ROLES_PERMISSIONS_QUERY_KEYS.all, 'list'] as const,
  /** Key for a list query with typed, serializable filter values. */
  list: (filters: Readonly<Record<string, string | number | boolean | null | undefined>>) => [...SUPERADMIN_USERS_ROLES_PERMISSIONS_QUERY_KEYS.lists(), filters] as const,
  /** Prefix for detail queries owned by this leaf. */
  details: () => [...SUPERADMIN_USERS_ROLES_PERMISSIONS_QUERY_KEYS.all, 'detail'] as const,
  /** Key for a detail query for a stable record identifier. */
  detail: (id: string) => [...SUPERADMIN_USERS_ROLES_PERMISSIONS_QUERY_KEYS.details(), id] as const,
} as const;
