// RESPONSIBILITY: Define isolated mock handlers for billing member invoices; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_member_invoices/mocks/handlers/SuperadminBillingInvoicesMemberInvoicesMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No verified HTTP contract is supplied for member_invoices; do not invent endpoints or write success. */
export const SUPERADMIN_FINANCE_INVOICE_MSW_HANDLERS: never[] = [];
