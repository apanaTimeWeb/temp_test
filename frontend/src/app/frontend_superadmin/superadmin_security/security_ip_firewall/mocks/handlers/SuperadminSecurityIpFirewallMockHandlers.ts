// RESPONSIBILITY: Define isolated mock handlers for security ip firewall; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_ip_firewall/mocks/handlers/SuperadminSecurityIpFirewallMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSECURITYIPFIREWALL_MOCK_HANDLERS: readonly never[] = [];
