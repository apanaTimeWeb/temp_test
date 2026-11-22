// RESPONSIBILITY: Define isolated mock handlers for security threats; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_threats/mocks/handlers/SuperadminSecurityThreatsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYAUDITTHREATS_MOCK_HANDLERS: readonly never[] = [];
