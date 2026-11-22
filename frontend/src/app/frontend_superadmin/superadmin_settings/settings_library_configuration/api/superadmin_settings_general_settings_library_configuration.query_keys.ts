// RESPONSIBILITY: Define the typed API/query boundary for settings library configuration; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_settings/settings_library_configuration/api/superadmin_settings_general_settings_library_configuration.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_SYSTEM_SETTINGS_QUERY_KEYS = {
  all: ['superadmin_settings_library_configuration'] as const,
  lists: () => [...SUPERADMIN_SYSTEM_SETTINGS_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_SYSTEM_SETTINGS_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_SYSTEM_SETTINGS_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_SYSTEM_SETTINGS_QUERY_KEYS.details(), id] as const,
};
