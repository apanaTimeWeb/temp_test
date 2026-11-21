// RESPONSIBILITY: Define canonical route/configuration constants for settings general; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_general/config/superadmin_settings_general.url_config.ts -> typed constants -> owning route or API caller.

/** Public route contract for the General autonomous workflow. */
const SUPERADMIN_SETTINGS_GENERAL_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_general',
  SCREEN: '/superadmin/superadmin_settings/settings_general',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

/** Public route contract for library configuration workflow. */
const SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
  SCREEN: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
} as const;

/** Canonical internal workflow routes; each workflow remains inside the approved owning leaf. */
const SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS = {
  SETTINGS_LIBRARY_CONFIGURATION: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
} as const;

/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_GENERAL_ROUTES = {
  SUPERADMIN_SETTINGS_GENERAL_URLS,
  SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS,
  SUPERADMIN_SETTINGS_GENERAL_WORKFLOW_URLS,
  root: '/superadmin/superadmin_settings/settings_general' as const,
  branding: '/superadmin/superadmin_settings/settings_branding' as const,
} as const;

/** Canonical API endpoint constants for settings general. */
export const SUPERADMIN_SETTINGS_GENERAL_API = {
  get: '/api/v1/superadmin/settings/general' as const,
  update: '/api/v1/superadmin/settings/general' as const,
  reset: '/api/v1/superadmin/settings/general/reset' as const,
} as const;

/** Leaf-local navigation route map. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  settings_appearance: '/superadmin/superadmin_settings/settings_branding',
  settings_general: '/superadmin/superadmin_settings/settings_general',
  settings_branding: '/superadmin/superadmin_settings/settings_branding',
  settings_integrations: '/superadmin/superadmin_integrations/integrations_overview',
  settings_storage: '/superadmin/superadmin_data/data_overview',
} as const;
