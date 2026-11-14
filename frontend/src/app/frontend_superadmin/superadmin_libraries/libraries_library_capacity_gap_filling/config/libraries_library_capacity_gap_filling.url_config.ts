// RESPONSIBILITY: Define canonical route/configuration constants for libraries library capacity gap filling; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_library_capacity_gap_filling/config/libraries_library_capacity_gap_filling.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the library_capacity_gap_filling workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_library_capacity_gap_filling',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling',
  DASHBOARD_RECOVERY: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_gap_filling",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_ROUTES = {
  SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_URLS: SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_GAP_FILLING_SYSTEM_GAP_FILLING_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_GAP_FILLING_API = {} as const;
