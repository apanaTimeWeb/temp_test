// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_RECEIPT_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/mocks/handlers/SuperadminBillingInvoicesMemberReceiptsMockHandlers';
import { SUPERADMIN_FINANCE_RECEIPT_DETAIL_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_receipts/mocks/handlers/SuperadminBillingInvoicesMemberReceiptsReceiptDetailMockHandlers';

/** Isolated MSW lifecycle for member_receipts; tests opt in by calling setupFinanceReceiptMockServer(). */
export const FINANCE_RECEIPT_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_RECEIPT_MSW_HANDLERS, ...SUPERADMIN_FINANCE_RECEIPT_DETAIL_MSW_HANDLERS);
/**
 * Performs the setup finance receipt mock server operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceReceiptMockServer(): void {
  beforeAll(() => FINANCE_RECEIPT_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_RECEIPT_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_RECEIPT_MOCK_SERVER.close());
}
