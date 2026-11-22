// RESPONSIBILITY: Define local sample fixtures for security ip firewall; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_ip_firewall/mocks/fixtures/SuperadminSecurityIpFirewallRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYIPFIREWALL_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_ip_firewall', source: 'local-preview' } as const;
