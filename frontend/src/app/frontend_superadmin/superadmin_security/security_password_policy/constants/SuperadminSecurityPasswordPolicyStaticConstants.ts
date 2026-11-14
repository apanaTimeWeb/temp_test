// RESPONSIBILITY: Define stable module-owned constants for security password policy; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_security/security_password_policy/constants/SuperadminSecurityPasswordPolicyStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminSecurityPasswordPolicyPageClient.tsx. */
export const SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS = ['id', 'ip', 'user', 'time', 'reason'] as const;

