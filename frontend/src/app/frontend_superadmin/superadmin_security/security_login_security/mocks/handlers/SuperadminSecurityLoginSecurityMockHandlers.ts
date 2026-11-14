// RESPONSIBILITY: Define isolated mock handlers for security login security; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_login_security/mocks/handlers/SuperadminSecurityLoginSecurityMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYLOGINSECURITY_MOCK_HANDLERS: readonly never[] = [];
