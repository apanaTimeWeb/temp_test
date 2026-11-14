// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_FINANCE_INVOICE_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/mocks/handlers/SuperadminBillingInvoicesMemberInvoicesMockHandlers';
import { SUPERADMIN_FINANCE_INVOICE_DETAIL_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_invoices/mocks/handlers/SuperadminBillingInvoicesMemberInvoicesInvoiceDetailMockHandlers';

/** Isolated MSW lifecycle for member_invoices; tests opt in by calling setupFinanceInvoiceMockServer(). */
export const FINANCE_INVOICE_MOCK_SERVER = setupServer(...SUPERADMIN_FINANCE_INVOICE_MSW_HANDLERS, ...SUPERADMIN_FINANCE_INVOICE_DETAIL_MSW_HANDLERS);
/**
 * Performs the setup finance invoice mock server operation within billing invoices; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupFinanceInvoiceMockServer(): void {
  beforeAll(() => FINANCE_INVOICE_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => FINANCE_INVOICE_MOCK_SERVER.resetHandlers());
  afterAll(() => FINANCE_INVOICE_MOCK_SERVER.close());
}
