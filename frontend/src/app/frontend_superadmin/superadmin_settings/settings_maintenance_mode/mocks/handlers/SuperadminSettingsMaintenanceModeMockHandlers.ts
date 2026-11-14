// RESPONSIBILITY: Define isolated mock handlers for settings maintenance mode; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_maintenance_mode/mocks/handlers/SuperadminSettingsMaintenanceModeMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSETTINGSMAINTENANCEMODE_MOCK_HANDLERS: readonly never[] = [];
