// RESPONSIBILITY: Define stable module-owned constants for security threats; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_security/security_threats/constants/SuperadminSecurityThreatsStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminSecurityThreatsPageClient.tsx. */
export const SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS = ['id', 'ip', 'user', 'time', 'reason'] as const;

