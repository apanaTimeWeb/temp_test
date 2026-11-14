// RESPONSIBILITY: Define the typed API/query boundary for libraries library capacity analysis; it does not invent host endpoints or backend guarantees.
// FLOW: Feature caller -> superadmin_libraries/libraries_library_capacity_analysis/api/superadmin_libraries_overview_library_capacity_analysis.query_keys.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Resource-scoped query key registry. This does not imply an API endpoint. */
export const SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS = {
  all: ['superadmin_library_capacity_analysis'] as const,
  lists: () => [...SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...SUPERADMIN_ACCOUNTING_SEAT_GAP_REPORT_QUERY_KEYS.details(), id] as const,
};
