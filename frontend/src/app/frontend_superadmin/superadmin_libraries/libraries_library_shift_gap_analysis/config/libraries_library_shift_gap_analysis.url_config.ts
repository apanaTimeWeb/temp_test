// RESPONSIBILITY: Define canonical route/configuration constants for libraries library shift gap analysis; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_library_shift_gap_analysis/config/libraries_library_shift_gap_analysis.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the library_shift_gap_analysis workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_LIBRARY_SHIFT_GAP_ANALYSIS_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_library_shift_gap_analysis',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=library_shift_gap_analysis",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_LIBRARY_SHIFT_GAP_ANALYSIS_ROUTES = {
  SUPERADMIN_LIBRARIES_LIBRARY_SHIFT_GAP_ANALYSIS_URLS: SUPERADMIN_LIBRARIES_LIBRARY_SHIFT_GAP_ANALYSIS_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_LIBRARY_SHIFT_GAP_ANALYSIS_ACCOUNTING_SHIFT_GAP_ANALYZER_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_LIBRARY_SHIFT_GAP_ANALYSIS_API = {} as const;
