// RESPONSIBILITY: Define isolated mock handlers for settings appearance; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_appearance/mocks/handlers/SuperadminSettingsAppearanceMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSETTINGSAPPEARANCE_MOCK_HANDLERS: readonly never[] = [];
