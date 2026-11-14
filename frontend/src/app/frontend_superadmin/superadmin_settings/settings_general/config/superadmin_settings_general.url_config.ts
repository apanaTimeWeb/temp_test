// RESPONSIBILITY: Define canonical route/configuration constants for settings general; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_general/config/superadmin_settings_general.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the General autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SETTINGS_GENERAL_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_general',
  SCREEN: '/superadmin/superadmin_settings/settings_general',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract copied from the domain URL map; no backend endpoints are added. */
const SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS = {
  PAGE: "/superadmin/superadmin_settings/settings_general?view=settings_library_configuration",
  SCREEN: "/superadmin/superadmin_settings/settings_general?view=settings_library_configuration",
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS = {
  SETTINGS_LIBRARY_CONFIGURATION: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_GENERAL_ROUTES = {
  SUPERADMIN_SETTINGS_GENERAL_URLS: SUPERADMIN_SETTINGS_GENERAL_URLS,
  SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS: SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS,
  SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS: SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_GENERAL_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  settings_appearance: '/superadmin/superadmin_settings/settings_appearance',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_integrations: '/superadmin/superadmin_settings/settings_integrations',
  settings_maintenance_mode: '/superadmin/superadmin_settings/settings_maintenance_mode',
  settings_storage: '/superadmin/superadmin_settings/settings_storage',
} as const;
