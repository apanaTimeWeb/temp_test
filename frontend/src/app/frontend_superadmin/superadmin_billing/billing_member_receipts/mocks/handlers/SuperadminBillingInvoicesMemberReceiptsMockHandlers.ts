// RESPONSIBILITY: Define isolated mock handlers for billing member receipts; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_receipts/mocks/handlers/SuperadminBillingInvoicesMemberReceiptsMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_receipts; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_RECEIPT_MSW_HANDLERS: never[] = [];
