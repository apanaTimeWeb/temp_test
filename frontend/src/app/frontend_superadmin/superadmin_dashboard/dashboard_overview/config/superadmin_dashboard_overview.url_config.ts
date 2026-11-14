// RESPONSIBILITY: Define canonical route/configuration constants for dashboard overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Page navigation paths used by the Superadmin dashboard; no API contract was supplied. */
const SUPERADMIN_DASHBOARD_URLS = {
  PAGE: '/superadmin/superadmin_dashboard',
  AUDIT_LOGS: '/superadmin/superadmin_system/audit_logs',
  LIBRARIES: '/superadmin/superadmin_libraries',
  SUBSCRIPTIONS: '/superadmin/superadmin_subscriptions',
  SUPPORT_TICKETS: '/superadmin/superadmin_support',
  SYSTEM_HEALTH: '/superadmin/superadmin_system/system_health_overview',
  BILLING: '/superadmin/superadmin_billing',
} as const;

/** Required typed grouping alias consumed by the module. */
const MODULE_URLS = SUPERADMIN_DASHBOARD_URLS;
/**
 * Defines the public ModuleUrls contract for dashboard overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

const SUPERADMIN_DASHBOARD_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_dashboard/dashboard_overview",
  SCREEN: "/superadmin/superadmin_dashboard/dashboard_overview",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES = {
  SUPERADMIN_DASHBOARD_URLS: SUPERADMIN_DASHBOARD_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_DASHBOARD_OVERVIEW_URLS: SUPERADMIN_DASHBOARD_OVERVIEW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_DASHBOARD_OVERVIEW_API = {} as const;
