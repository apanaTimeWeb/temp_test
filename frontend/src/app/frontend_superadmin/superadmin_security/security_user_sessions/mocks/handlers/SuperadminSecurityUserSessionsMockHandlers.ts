// RESPONSIBILITY: Define isolated mock handlers for security user sessions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_user_sessions/mocks/handlers/SuperadminSecurityUserSessionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINUSERSSESSIONS_MOCK_HANDLERS: readonly never[] = [];
