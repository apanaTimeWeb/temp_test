// RESPONSIBILITY: Define isolated mock handlers for billing member security deposits; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_security_deposits/mocks/handlers/SuperadminBillingOverviewMemberSecurityDepositsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_security_deposits; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_SECURITY_DEPOSITS_MSW_HANDLERS: never[] = [];
