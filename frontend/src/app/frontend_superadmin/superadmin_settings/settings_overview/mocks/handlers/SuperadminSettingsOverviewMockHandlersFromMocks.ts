// RESPONSIBILITY: Define isolated mock handlers for settings overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_overview/mocks/handlers/SuperadminSettingsOverviewMockHandlersFromMocks.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for settings_overview; do not invent endpoints or write success. */
export const SUPERADMIN_SETTINGS_OVERVIEW_MSW_HANDLERS: never[] = [];
