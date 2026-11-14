// RESPONSIBILITY: Define isolated mock handlers for settings profile login history; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_profile_login_history/mocks/handlers/SuperadminProfileLoginHistoryMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINPROFILELOGINHISTORY_MOCK_HANDLERS: readonly never[] = [];
