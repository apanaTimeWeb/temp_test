// RESPONSIBILITY: Define isolated mock handlers for security mfa; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_mfa/mocks/handlers/SuperadminSecurityMfaMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYMFA_MOCK_HANDLERS: readonly never[] = [];
