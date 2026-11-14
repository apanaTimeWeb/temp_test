// RESPONSIBILITY: Define canonical route/configuration constants for settings profile login history; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_settings/settings_profile_login_history/config/superadmin_profile_login_history.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Login History autonomous workflow; no API contract is inferred. */
const SUPERADMIN_PROFILE_LOGIN_HISTORY_URLS = {
  PAGE: '/superadmin/superadmin_settings/profile_login_history',
  SCREEN: '/superadmin/superadmin_settings/profile_login_history',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;

const SUPERADMIN_PROFILE_URLS = { AUTH_LOGIN: '/auth/login', PAGE: '/superadmin/superadmin_settings' } as const;
const MODULE_URLS = SUPERADMIN_PROFILE_URLS;



/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SETTINGS_PROFILE_LOGIN_HISTORY_ROUTES = {
  SUPERADMIN_PROFILE_LOGIN_HISTORY_URLS: SUPERADMIN_PROFILE_LOGIN_HISTORY_URLS,
  SUPERADMIN_PROFILE_URLS: SUPERADMIN_PROFILE_URLS,
  MODULE_URLS: MODULE_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SETTINGS_PROFILE_LOGIN_HISTORY_API = {} as const;

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
