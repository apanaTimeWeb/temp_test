// RESPONSIBILITY: Define isolated mock handlers for security active sessions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_active_sessions/mocks/handlers/SuperadminSecurityActiveSessionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYACTIVESESSIONS_MOCK_HANDLERS: readonly never[] = [];
