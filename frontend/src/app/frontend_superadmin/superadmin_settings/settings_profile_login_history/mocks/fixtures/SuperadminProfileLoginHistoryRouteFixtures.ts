// RESPONSIBILITY: Define local sample fixtures for settings profile login history; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_profile_login_history/mocks/fixtures/SuperadminProfileLoginHistoryRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINPROFILELOGINHISTORY_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/profile_login_history', source: 'local-preview' } as const;
