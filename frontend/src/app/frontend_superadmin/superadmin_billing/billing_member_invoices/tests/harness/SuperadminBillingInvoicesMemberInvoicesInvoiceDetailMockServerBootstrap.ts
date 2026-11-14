// RESPONSIBILITY: Define source-level test coverage for billing member invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_invoices/tests/harness/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailMockServerBootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_INVOICE_DETAIL_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/mocks/handlers/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailMockHandlers';

/** Isolated MSW lifecycle for member_invoice_detail; tests opt in by calling setupFinanceInvoiceDetailMockServer(). */
export const FINANCE_INVOICE_DETAIL_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_INVOICE_DETAIL_MSW_HANDLERS);
/**
 * Performs the setup finance invoice detail mock server operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceInvoiceDetailMockServer(): void {
  beforeAll(() => FINANCE_INVOICE_DETAIL_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_INVOICE_DETAIL_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_INVOICE_DETAIL_MOCK_SERVER.close());
}
