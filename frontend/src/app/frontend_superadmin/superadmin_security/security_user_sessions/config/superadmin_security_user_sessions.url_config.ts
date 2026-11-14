// RESPONSIBILITY: Define canonical route/configuration constants for security user sessions; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_security/security_user_sessions/config/superadmin_security_user_sessions.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the User Sessions autonomous workflow; no API contract is inferred. */
const SUPERADMIN_USERS_SESSIONS_URLS = {
  PAGE: '/superadmin/superadmin_security/security_user_sessions',
  SCREEN: '/superadmin/superadmin_security/security_user_sessions',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SECURITY_USER_SESSIONS_ROUTES = {
  SUPERADMIN_USERS_SESSIONS_URLS: SUPERADMIN_USERS_SESSIONS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SECURITY_USER_SESSIONS_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  security_user_sessions: '/superadmin/superadmin_security/security_user_sessions',
  users_directory: '/superadmin/superadmin_users/users_directory',
  users_roles_permissions: '/superadmin/superadmin_users/users_roles_permissions',
} as const;
