// RESPONSIBILITY: Define canonical route/configuration constants for libraries facility power management; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_facility_power_management/config/libraries_facility_power_management.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the facility_power_management workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_facility_power_management',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_power_management",
} as const;


/** Verified dashboard recovery destination copied from the owning dashboard route contract; no sibling business import is required. */
const SUPERADMIN_DASHBOARD_OVERVIEW_RECOVERY_URL = '/superadmin/superadmin_dashboard/dashboard_overview' as const;

/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_ROUTES = {
  SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_URLS: SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_URLS,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_POWER_MANAGEMENT_SYSTEM_POWER_SAVING_URLS,
  DASHBOARD_RECOVERY: SUPERADMIN_DASHBOARD_OVERVIEW_RECOVERY_URL
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_FACILITY_POWER_MANAGEMENT_API = {} as const;
