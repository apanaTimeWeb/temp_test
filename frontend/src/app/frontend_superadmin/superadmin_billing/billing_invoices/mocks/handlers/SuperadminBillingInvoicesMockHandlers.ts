// RESPONSIBILITY: Define isolated mock handlers for billing invoices; they do not establish a live backend contract.
// FLOW: Feature test harness -> superadmin_billing/billing_invoices/mocks/handlers/SuperadminBillingInvoicesMockHandlers.ts -> module fixtures and declared mock routes -> isolated test response.
/** No network handler is registered until a verified API contract exists. */
export const SUPERADMINBILLINGINVOICES_MOCK_HANDLERS: readonly never[] = [];
