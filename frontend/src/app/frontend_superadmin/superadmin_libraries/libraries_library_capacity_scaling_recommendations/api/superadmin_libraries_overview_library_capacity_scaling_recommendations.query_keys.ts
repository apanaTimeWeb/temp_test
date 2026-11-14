// RESPONSIBILITY: Define the typed API/query boundary for libraries library capacity scaling recommendations; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_libraries/libraries_library_capacity_scaling_recommendations/api/superadmin_libraries_overview_library_capacity_scaling_recommendations.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS = {
  all: ['superadmin_library_capacity_scaling_recommendations'] as const,
  lists: () => [...SUPERADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_SYSTEM_AUTO_SCALE_QUERY_KEYS.details(), id] as const,
};
