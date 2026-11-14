// RESPONSIBILITY: Define isolated mock handlers for subscriptions active subscribers; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_subscriptions/subscriptions_active_subscribers/mocks/handlers/SuperadminSubscriptionsActiveSubscribersMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINSUBSCRIPTIONSACTIVESUBSCRIBERS_MOCK_HANDLERS: readonly never[] = [];
