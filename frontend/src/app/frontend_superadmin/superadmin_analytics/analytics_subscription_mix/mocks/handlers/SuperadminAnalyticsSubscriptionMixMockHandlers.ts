// RESPONSIBILITY: Define isolated mock handlers for analytics subscription mix; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_analytics/analytics_subscription_mix/mocks/handlers/SuperadminAnalyticsSubscriptionMixMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINREPORTSSUBSCRIPTIONMIX_MOCK_HANDLERS: readonly never[] = [];
