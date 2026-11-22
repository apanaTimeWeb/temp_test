// RESPONSIBILITY: Define canonical route/configuration constants for security login security; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_security/security_login_security/config/superadmin_security_login_security.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Login Security autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SECURITY_LOGIN_SECURITY_URLS = {
  PAGE: '/superadmin/superadmin_security/security_login_security',
  SCREEN: '/superadmin/superadmin_security/security_login_security',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SECURITY_LOGIN_SECURITY_ROUTES = {
  SUPERADMIN_SECURITY_LOGIN_SECURITY_URLS: SUPERADMIN_SECURITY_LOGIN_SECURITY_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SECURITY_LOGIN_SECURITY_API = {} as const;

/** Leaf-local navigation route map copied verbatim from this page client. Route values are source-observed and must not imply backend behavior. */
export const SUPERADMIN_NAVIGATION_ROUTES = {
  security_active_sessions: '/superadmin/superadmin_security/security_active_sessions',
  security_api_keys: '/superadmin/superadmin_security/security_api_keys',
  security_ip_firewall: '/superadmin/superadmin_security/security_ip_firewall',
  security_login_security: '/superadmin/superadmin_security/security_login_security',
  security_mfa: '/superadmin/superadmin_security/security_mfa',
  security_password_policy: '/superadmin/superadmin_security/security_password_policy',
  security_threats: '/superadmin/superadmin_security/security_threats',
} as const;
