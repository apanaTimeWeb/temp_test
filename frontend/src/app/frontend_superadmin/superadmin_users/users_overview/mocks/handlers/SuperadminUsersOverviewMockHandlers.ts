// RESPONSIBILITY: Define isolated mock handlers for users overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_users/users_overview/mocks/handlers/SuperadminUsersOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for users_overview; do not invent endpoints or write success. */
export const SUPERADMIN_USERS_OVERVIEW_MSW_HANDLERS: never[] = [];
