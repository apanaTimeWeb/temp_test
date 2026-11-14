// RESPONSIBILITY: Define canonical route/configuration constants for libraries facility asset maintenance; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_libraries/libraries_facility_asset_maintenance/config/libraries_facility_asset_maintenance.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the facility_asset_maintenance workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_URLS = {
  PAGE: '/superadmin/superadmin_libraries/libraries_facility_asset_maintenance',
  SCREEN: '/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS = {
  PAGE: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance",
  SCREEN: "/superadmin/superadmin_libraries/libraries_overview?view=facility_asset_maintenance",
} as const;


/** Verified dashboard recovery destination copied from the owning dashboard route contract; no sibling business import is required. */
const SUPERADMIN_DASHBOARD_OVERVIEW_RECOVERY_URL = '/superadmin/superadmin_dashboard/dashboard_overview' as const;

/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_ROUTES = {
  SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_URLS: SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_URLS,
  DASHBOARD_RECOVERY: SUPERADMIN_DASHBOARD_OVERVIEW_RECOVERY_URL,
  SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS: SUPERADMIN_LIBRARIES_OVERVIEW_FACILITY_ASSET_MAINTENANCE_ACCOUNTING_ASSET_MAINTENANCE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_LIBRARIES_FACILITY_ASSET_MAINTENANCE_API = {} as const;
