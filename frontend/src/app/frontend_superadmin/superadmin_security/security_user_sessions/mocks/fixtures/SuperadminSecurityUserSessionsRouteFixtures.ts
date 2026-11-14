// RESPONSIBILITY: Define local sample fixtures for security user sessions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_user_sessions/mocks/fixtures/SuperadminSecurityUserSessionsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINUSERSSESSIONS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_user_sessions', source: 'local-preview' } as const;
