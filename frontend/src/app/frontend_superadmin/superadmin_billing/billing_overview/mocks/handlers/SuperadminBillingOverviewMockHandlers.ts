// RESPONSIBILITY: Define isolated mock handlers for billing overview; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_overview/mocks/handlers/SuperadminBillingOverviewMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for billing_overview; do not invent endpoints or write success. */
export const SUPERADMIN_BILLING_OVERVIEW_MSW_HANDLERS: never[] = [];
