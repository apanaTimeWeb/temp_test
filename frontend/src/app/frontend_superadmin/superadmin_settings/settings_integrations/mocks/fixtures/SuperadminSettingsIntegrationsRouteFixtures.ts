// RESPONSIBILITY: Define local sample fixtures for settings integrations; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_settings/settings_integrations/mocks/fixtures/SuperadminSettingsIntegrationsRouteFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Route-only fixture; no backend entity fields are inferred. */
export const SUPERADMINSETTINGSINTEGRATIONS_ROUTE_FIXTURE = { route: '/superadmin/superadmin_settings/settings_integrations', source: 'local-preview' } as const;
