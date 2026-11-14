// RESPONSIBILITY: Define canonical route/configuration constants for libraries library capacity scaling recommendations; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_library_capacity_scaling_recommendations/config/libraries_library_capacity_scaling_recommendations.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the library_capacity_scaling_recommendations workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_capacity_scaling_recommendations",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_ROUTES = {
  SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_URLS: SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_SYSTEM_AUTO_SCALE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_LIBRARY_CAPACITY_SCALING_RECOMMENDATIONS_API = {} as const;
