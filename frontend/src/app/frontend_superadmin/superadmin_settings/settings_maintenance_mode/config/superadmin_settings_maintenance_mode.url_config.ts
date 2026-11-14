// RESPONSIBILITY: Define canonical route/configuration constants for settings maintenance mode; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_maintenance_mode/config/superadmin_settings_maintenance_mode.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Maintenance Mode autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SETTINGS_MAINTENANCE_MODE_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_maintenance_mode',
  SCREEN: '/superadmin/superadmin_settings/settings_maintenance_mode',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_MAINTENANCE_MODE_ROUTES = {
  SUPERADMIN_SETTINGS_MAINTENANCE_MODE_URLS: SUPERADMIN_SETTINGS_MAINTENANCE_MODE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_MAINTENANCE_MODE_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  settings_appearance: '/superadmin/superadmin_settings/settings_appearance',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_integrations: '/superadmin/superadmin_settings/settings_integrations',
  settings_maintenance_mode: '/superadmin/superadmin_settings/settings_maintenance_mode',
  settings_storage: '/superadmin/superadmin_settings/settings_storage',
} as const;
