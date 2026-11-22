// RESPONSIBILITY: Define the typed API/query boundary for navigation shell; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_navigation/navigation_shell/api/superadmin_navigation_shell.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS = {
  all: ['superadmin_navigation_shell'] as const,
  lists: () => [...SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_NAVIGATION_SHELL_QUERY_KEYS.details(), id] as const,
};
