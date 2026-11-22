// RESPONSIBILITY: Define local sample fixtures for security active sessions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_security/security_active_sessions/mocks/fixtures/SuperadminSecurityActiveSessionsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSECURITYACTIVESESSIONS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_security/security_active_sessions', source: 'local-preview' } as const;
