// RESPONSIBILITY: Define local sample fixtures for settings profile overview; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_profile_overview/mocks/fixtures/SuperadminProfileOverviewEditRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINPROFILEEDIT_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/profile_overview?view=edit', source: 'local-preview' } as const;
