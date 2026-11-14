// RESPONSIBILITY: Define isolated mock handlers for settings profile security; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_settings/settings_profile_security/mocks/handlers/SuperadminProfileSecurityChangePasswordMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINPROFILECHANGEPASSWORD_MOCK_HANDLERS: readonly never[] = [];
