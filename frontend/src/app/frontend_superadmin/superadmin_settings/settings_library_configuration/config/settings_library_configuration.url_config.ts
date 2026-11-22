// RESPONSIBILITY: Define canonical route/configuration constants for settings library configuration; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_library_configuration/config/settings_library_configuration.url_config.ts -> typed constants -> owning route or API caller.
/** Leaf-owned route contract for the settings_library_configuration workflow. The legacy query-view URL remains supported. */
const SUPERADMIN_LIBRARIES_SETTINGS_LIBRARY_CONFIGURATION_URLS = {
  PAGE: '/superadmin/superadmin_settings/settings_library_configuration',
  SCREEN: '/superadmin/superadmin_settings/settings_general?view=settings_library_configuration',
} as const;

/** Compatibility export retains the exact pre-migration public query-view values. */
const SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS = {
  PAGE: "/superadmin/superadmin_settings/settings_general?view=settings_library_configuration",
  SCREEN: "/superadmin/superadmin_settings/settings_general?view=settings_library_configuration",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_LIBRARY_CONFIGURATION_ROUTES = {
  SUPERADMIN_LIBRARIES_SETTINGS_LIBRARY_CONFIGURATION_URLS: SUPERADMIN_LIBRARIES_SETTINGS_LIBRARY_CONFIGURATION_URLS,
  SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS: SUPERADMIN_SETTINGS_GENERAL_SETTINGS_LIBRARY_CONFIGURATION_SYSTEM_SETTINGS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_LIBRARY_CONFIGURATION_API = {} as const;
