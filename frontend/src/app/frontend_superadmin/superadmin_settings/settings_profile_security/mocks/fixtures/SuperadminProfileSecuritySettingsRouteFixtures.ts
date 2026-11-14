// RESPONSIBILITY: Define local sample fixtures for settings profile security; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_profile_security/mocks/fixtures/SuperadminProfileSecuritySettingsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINPROFILESECURITYSETTINGS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/profile_security', source: 'local-preview' } as const;
