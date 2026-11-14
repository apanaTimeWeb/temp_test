// RESPONSIBILITY: Define isolated mock handlers for settings profile active sessions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_profile_active_sessions/mocks/handlers/SuperadminProfileActiveSessionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINPROFILEACTIVESESSIONS_MOCK_HANDLERS: readonly never[] = [];
