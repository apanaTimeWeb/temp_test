// RESPONSIBILITY: Define isolated mock handlers for subscriptions member subscriptions; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_subscriptions/subscriptions_member_subscriptions/mocks/handlers/SuperadminSubscriptionsOverviewMemberSubscriptionsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_subscriptions; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_SUBSCRIPTIONS_MSW_HANDLERS: never[] = [];
