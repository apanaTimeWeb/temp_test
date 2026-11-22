// RESPONSIBILITY: Define isolated mock handlers for navigation shell; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_navigation/navigation_shell/mocks/handlers/SuperadminNavigationShellMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for navigation_shell; do not invent endpoints or write success. */
export const SUPERADMIN_NAVIGATION_SHELL_MSW_HANDLERS: never[] = [];
