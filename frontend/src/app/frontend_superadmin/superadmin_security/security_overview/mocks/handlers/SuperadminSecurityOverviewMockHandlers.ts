// RESPONSIBILITY: Define isolated mock handlers for security overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_security/security_overview/mocks/handlers/SuperadminSecurityOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for security_overview; do not invent endpoints or write success. */
export const SUPERADMIN_SECURITY_OVERVIEW_MSW_HANDLERS: never[] = [];
