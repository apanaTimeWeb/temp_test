// RESPONSIBILITY: Define isolated mock handlers for security api keys; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_api_keys/mocks/handlers/SuperadminSecurityApiKeysMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYAPIKEYS_MOCK_HANDLERS: readonly never[] = [];
