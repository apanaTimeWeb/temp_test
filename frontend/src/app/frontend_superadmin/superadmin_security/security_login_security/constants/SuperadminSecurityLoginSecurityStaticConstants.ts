// RESPONSIBILITY: Define stable module-owned constants for security login security; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_security/security_login_security/constants/SuperadminSecurityLoginSecurityStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminSecurityLoginSecurityPageClient.tsx. */
export const SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS = ['id', 'ip', 'user', 'time', 'reason'] as const;

