// RESPONSIBILITY: Define isolated mock handlers for analytics overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_analytics/analytics_overview/mocks/handlers/SuperadminAnalyticsOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for analytics_overview; do not invent endpoints or write success. */
export const SUPERADMIN_REPORTS_OVERVIEW_MSW_HANDLERS: never[] = [];
