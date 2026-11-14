// RESPONSIBILITY: Define source-level test coverage for billing member invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_invoices/tests/harness/bootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
/** Canonical standalone harness entrypoint; delegates to the preserved workflow bootstrap. */
export { FINANCE_INVOICE_MOCK_SERVER, setupFinanceInvoiceMockServer } from './SuperadminBillingInvoicesMemberInvoicesWorkflowBootstrap';
