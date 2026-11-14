// RESPONSIBILITY: Define isolated mock handlers for billing member payment promises; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_payment_promises/mocks/handlers/SuperadminBillingOverviewMemberPaymentPromisesMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_payment_promises; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_PAYMENT_PROMISES_MSW_HANDLERS: never[] = [];
