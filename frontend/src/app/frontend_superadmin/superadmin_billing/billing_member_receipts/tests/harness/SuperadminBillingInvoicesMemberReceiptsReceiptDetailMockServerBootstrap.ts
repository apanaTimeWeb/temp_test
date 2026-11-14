// RESPONSIBILITY: Define source-level test coverage for billing member receipts using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_member_receipts/tests/harness/SuperadminBillingInvoicesMemberReceiptsReceiptDetailMockServerBootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_RECEIPT_DETAIL_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/mocks/handlers/SuperadminBillingInvoicesMemberReceiptsReceiptDetailMockHandlers';

/** Isolated MSW lifecycle for member_receipt_detail; tests opt in by calling setupFinanceReceiptDetailMockServer(). */
export const FINANCE_RECEIPT_DETAIL_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_RECEIPT_DETAIL_MSW_HANDLERS);
/**
 * Performs the setup finance receipt detail mock server operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceReceiptDetailMockServer(): void {
  beforeAll(() => FINANCE_RECEIPT_DETAIL_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_RECEIPT_DETAIL_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_RECEIPT_DETAIL_MOCK_SERVER.close());
}
