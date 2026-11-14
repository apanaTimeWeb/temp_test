// RESPONSIBILITY: Define local sample fixtures for settings profile active sessions; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_profile_active_sessions/mocks/fixtures/SuperadminProfileActiveSessionsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINPROFILEACTIVESESSIONS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/profile_active_sessions', source: 'local-preview' } as const;
