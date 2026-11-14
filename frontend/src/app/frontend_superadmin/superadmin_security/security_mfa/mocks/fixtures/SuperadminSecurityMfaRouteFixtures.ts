// RESPONSIBILITY: Define local sample fixtures for security mfa; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_mfa/mocks/fixtures/SuperadminSecurityMfaRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYMFA_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_mfa', source: 'local-preview' } as const;
