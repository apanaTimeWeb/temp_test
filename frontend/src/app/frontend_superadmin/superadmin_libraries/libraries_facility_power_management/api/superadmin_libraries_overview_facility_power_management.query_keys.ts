// RESPONSIBILITY: Define the typed API/query boundary for libraries facility power management; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_libraries/libraries_facility_power_management/api/superadmin_libraries_overview_facility_power_management.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS = {
  all: ['superadmin_facility_power_management'] as const,
  lists: () => [...SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_SYSTEM_POWER_SAVING_QUERY_KEYS.details(), id] as const,
};
