// RESPONSIBILITY: Define isolated mock handlers for dashboard overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_dashboard/dashboard_overview/mocks/handlers/SuperadminDashboardOverviewMockHandlersFromMocks.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for dashboard_overview; do not invent endpoints or write success. */
export const SUPERADMIN_DASHBOARD_OVERVIEW_MSW_HANDLERS: never[] = [];
