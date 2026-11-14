// RESPONSIBILITY: Define local sample fixtures for security threats; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_threats/mocks/fixtures/SuperadminSecurityThreatsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYAUDITTHREATS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_threats', source: 'local-preview' } as const;
