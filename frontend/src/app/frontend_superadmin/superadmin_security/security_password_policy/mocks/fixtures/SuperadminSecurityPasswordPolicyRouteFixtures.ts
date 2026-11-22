// RESPONSIBILITY: Define local sample fixtures for security password policy; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_password_policy/mocks/fixtures/SuperadminSecurityPasswordPolicyRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYPASSWORDPOLICY_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_password_policy', source: 'local-preview' } as const;
