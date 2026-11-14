// RESPONSIBILITY: Define local sample fixtures for settings general; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_general/mocks/fixtures/SuperadminSettingsGeneralRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSETTINGSGENERAL_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/settings_general', source: 'local-preview' } as const;
