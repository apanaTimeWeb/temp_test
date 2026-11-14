// RESPONSIBILITY: Define local sample fixtures for settings storage; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_storage/mocks/fixtures/SuperadminSettingsStorageRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSETTINGSSTORAGE_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/settings_storage', source: 'local-preview' } as const;
