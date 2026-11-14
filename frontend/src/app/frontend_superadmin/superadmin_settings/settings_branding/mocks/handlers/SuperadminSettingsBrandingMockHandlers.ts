// RESPONSIBILITY: Define isolated mock handlers for settings branding; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_branding/mocks/handlers/SuperadminSettingsBrandingMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for settings_branding; do not invent endpoints or write success. */
export const SUPERADMIN_SYSTEM_BRANDING_MSW_HANDLERS: never[] = [];
