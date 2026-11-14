// RESPONSIBILITY: Define stable module-owned constants for security ip firewall; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_security/security_ip_firewall/constants/SuperadminSecurityIpFirewallStaticConstants.ts -> typed constants -> component/hook/config behavior.


/** Static module-owned options/status mapping extracted from SuperadminSecurityIpFirewallPageClient.tsx. */
export const SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS = ['id', 'ip', 'user', 'time', 'reason'] as const;

