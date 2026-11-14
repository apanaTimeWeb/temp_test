// RESPONSIBILITY: Define isolated mock handlers for subscriptions member renewals; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_subscriptions/subscriptions_member_renewals/mocks/handlers/SuperadminSubscriptionsOverviewMemberRenewalsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_renewals; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_RENEWALS_MSW_HANDLERS: never[] = [];
