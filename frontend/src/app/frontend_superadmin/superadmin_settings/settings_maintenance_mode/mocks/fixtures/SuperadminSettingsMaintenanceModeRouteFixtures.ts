// RESPONSIBILITY: Define local sample fixtures for settings maintenance mode; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_maintenance_mode/mocks/fixtures/SuperadminSettingsMaintenanceModeRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSETTINGSMAINTENANCEMODE_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/settings_maintenance_mode', source: 'local-preview' } as const;
