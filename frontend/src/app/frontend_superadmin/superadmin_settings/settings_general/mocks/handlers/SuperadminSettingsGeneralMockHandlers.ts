// RESPONSIBILITY: Define isolated mock handlers for settings general; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_general/mocks/handlers/SuperadminSettingsGeneralMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSETTINGSGENERAL_MOCK_HANDLERS: readonly never[] = [];
