// RESPONSIBILITY: Define isolated mock handlers for settings profile overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_profile_overview/mocks/handlers/SuperadminProfileOverviewEditMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINPROFILEEDIT_MOCK_HANDLERS: readonly never[] = [];
