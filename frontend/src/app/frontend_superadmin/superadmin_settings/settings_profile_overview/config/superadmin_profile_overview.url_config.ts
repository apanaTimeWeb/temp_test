// RESPONSIBILITY: Define canonical route/configuration constants for settings profile overview; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_profile_overview/config/superadmin_profile_overview.url_config.ts -> typed constants -> owning route or API caller.
/** Public URL aliases. The host Next.js rewrites in INTEGRATION_GUIDE.md map these aliases to the canonical frontend_superadmin route tree. */
const SUPERADMIN_PROFILE_URLS = {
  AUTH_LOGIN: '/auth/login',
  PAGE: '/superadmin/superadmin_settings',
} as const;

/**
 * No API endpoint strings are declared for this feature because the supplied
 * audit inputs contain no verified API contract for it. Do not invent paths.
 */
const MODULE_URLS = SUPERADMIN_PROFILE_URLS;
/**
 * Defines the public ModuleUrls contract for profile overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
type ModuleUrls = typeof MODULE_URLS;

/** Grouped public route contract for profile_overview; screens share this isolated feature module. */
const SUPERADMIN_PROFILE_OVERVIEW_URLS = {
  PAGE: "/superadmin/superadmin_settings/profile_overview",
  SCREEN: "/superadmin/superadmin_settings/profile_overview",
  SCREENS: {
    "profile_overview": "/superadmin/superadmin_settings/profile_overview",
  },
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_PROFILE_DETAILS_URLS = {
  PAGE: "/superadmin/superadmin_settings/profile_overview?view=details",
  SCREEN: "/superadmin/superadmin_settings/profile_overview?view=details",
} as const;


/** Route retained from a folded child workflow; no backend endpoint is inferred. */
const SUPERADMIN_PROFILE_EDIT_URLS = {
  PAGE: "/superadmin/superadmin_settings/profile_overview?view=edit",
  SCREEN: "/superadmin/superadmin_settings/profile_overview?view=edit",
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_PROFILE_OVERVIEW_ROUTES = {
  SUPERADMIN_PROFILE_URLS: SUPERADMIN_PROFILE_URLS,
  MODULE_URLS: MODULE_URLS,
  SUPERADMIN_PROFILE_OVERVIEW_URLS: SUPERADMIN_PROFILE_OVERVIEW_URLS,
  SUPERADMIN_PROFILE_DETAILS_URLS: SUPERADMIN_PROFILE_DETAILS_URLS,
  SUPERADMIN_PROFILE_EDIT_URLS: SUPERADMIN_PROFILE_EDIT_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_PROFILE_OVERVIEW_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  profile_active_sessions: '/superadmin/superadmin_settings/profile_active_sessions',
  profile_login_history: '/superadmin/superadmin_settings/profile_login_history',
  profile_overview__details: '/superadmin/superadmin_settings/profile_overview?view=details',
  profile_overview__edit: '/superadmin/superadmin_settings/profile_overview?view=edit',
  profile_security: '/superadmin/superadmin_settings/profile_security',
  profile_security__change_password: '/superadmin/superadmin_settings/profile_security?view=change-password',
  profile_security__two_factor: '/superadmin/superadmin_settings/profile_security?view=two-factor',
} as const;
