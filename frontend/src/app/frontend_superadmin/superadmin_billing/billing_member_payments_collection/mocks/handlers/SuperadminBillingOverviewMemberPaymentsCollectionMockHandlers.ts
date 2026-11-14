// RESPONSIBILITY: Define isolated mock handlers for billing member payments collection; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_payments_collection/mocks/handlers/SuperadminBillingOverviewMemberPaymentsCollectionMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_payments_collection; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_COLLECT_FEE_MSW_HANDLERS: never[] = [];
