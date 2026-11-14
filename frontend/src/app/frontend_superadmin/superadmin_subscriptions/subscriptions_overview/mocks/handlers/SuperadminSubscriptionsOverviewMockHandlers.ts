// RESPONSIBILITY: Define isolated mock handlers for subscriptions overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_subscriptions/subscriptions_overview/mocks/handlers/SuperadminSubscriptionsOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for subscriptions_overview; do not invent endpoints or write success. */
export const SUPERADMIN_SUBSCRIPTIONS_OVERVIEW_MSW_HANDLERS: never[] = [];
