// RESPONSIBILITY: Define canonical route/configuration constants for system health overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_system/system_health_overview/config/superadmin_system_health_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_system/system_health_overview",
  SCREEN: "/superadmin/superadmin_system/system_health_overview",
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_ROUTES = {
  SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_URLS: SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_API = {} as const;
