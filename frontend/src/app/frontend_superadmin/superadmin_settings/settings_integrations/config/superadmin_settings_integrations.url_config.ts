// RESPONSIBILITY: Define canonical route/configuration constants for settings integrations; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_integrations/config/superadmin_settings_integrations.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the APIs & Integrations autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SETTINGS_INTEGRATIONS_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_integrations',
  SCREEN: '/superadmin/superadmin_settings/settings_integrations',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_INTEGRATIONS_ROUTES = {
  SUPERADMIN_SETTINGS_INTEGRATIONS_URLS: SUPERADMIN_SETTINGS_INTEGRATIONS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_INTEGRATIONS_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  settings_appearance: '/superadmin/superadmin_settings/settings_appearance',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_integrations: '/superadmin/superadmin_settings/settings_integrations',
  settings_maintenance_mode: '/superadmin/superadmin_settings/settings_maintenance_mode',
  settings_storage: '/superadmin/superadmin_settings/settings_storage',
} as const;
