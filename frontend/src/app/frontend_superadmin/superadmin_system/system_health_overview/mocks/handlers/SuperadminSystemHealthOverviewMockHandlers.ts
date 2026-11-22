// RESPONSIBILITY: Define isolated mock handlers for system health overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_system/system_health_overview/mocks/handlers/SuperadminSystemHealthOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for system_health_overview; do not invent endpoints or write success. */
export const SUPERADMIN_SYSTEM_HEALTH_OVERVIEW_MSW_HANDLERS: never[] = [];
