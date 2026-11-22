// RESPONSIBILITY: Define canonical route/configuration constants for security threats; it does not perform navigation or network I/O itself.
// FLOW: Feature/navigation caller -> superadmin_security/security_threats/config/superadmin_security_threats.url_config.ts -> typed constants -> owning route or API caller.
/** Public route contract for the Audit & Threats autonomous workflow; no API contract is inferred. */
const SUPERADMIN_SECURITY_AUDIT_THREATS_URLS = {
  PAGE: '/superadmin/superadmin_security/security_threats',
  SCREEN: '/superadmin/superadmin_security/security_threats',
  DASHBOARD_OVERVIEW: '/superadmin/superadmin_dashboard/dashboard_overview',
} as const;


/** Canonical route contract; every value is retained from a pre-existing verified route constant. */
export const SUPERADMIN_SECURITY_THREATS_ROUTES = {
  SUPERADMIN_SECURITY_AUDIT_THREATS_URLS: SUPERADMIN_SECURITY_AUDIT_THREATS_URLS
} as const;

/** No verified API endpoint constants were supplied in this URL config. */
export const SUPERADMIN_SECURITY_THREATS_API = {} as const;

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
