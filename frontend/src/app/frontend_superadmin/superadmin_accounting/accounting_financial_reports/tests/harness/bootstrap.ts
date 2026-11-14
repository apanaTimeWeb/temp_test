// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/mocks/handlers/SuperadminAccountingFinancialReportsMockHandlers';

/** Isolated MSW lifecycle for accounting_financial_reports; tests opt in by calling setupAccountingFinancialReportsMockServer(). */
export const ACCOUNTING_FINANCIAL_REPORTS_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_MSW_HANDLERS);
/**
 * Performs the setup accounting financial reports mock server operation within accounting financial reports; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingFinancialReportsMockServer(): void {
  beforeAll(() => ACCOUNTING_FINANCIAL_REPORTS_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_FINANCIAL_REPORTS_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_FINANCIAL_REPORTS_MOCK_SERVER.close());
}
