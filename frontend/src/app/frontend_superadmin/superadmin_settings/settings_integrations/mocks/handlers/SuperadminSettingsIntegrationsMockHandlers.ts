// RESPONSIBILITY: Define isolated mock handlers for settings integrations; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_integrations/mocks/handlers/SuperadminSettingsIntegrationsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSETTINGSINTEGRATIONS_MOCK_HANDLERS: readonly never[] = [];
