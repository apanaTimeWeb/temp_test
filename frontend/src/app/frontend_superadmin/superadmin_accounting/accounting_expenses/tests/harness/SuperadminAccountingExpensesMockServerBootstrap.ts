// RESPONSIBILITY: Define source-level test coverage for accounting expenses using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expenses/tests/harness/SuperadminAccountingExpensesMockServerBootstrap.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_EXPENSES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/mocks/handlers/SuperadminAccountingExpensesMockHandlers';

/** Isolated MSW lifecycle for accounting_expenses; tests opt in by calling setupAccountingExpensesMockServer(). */
export const ACCOUNTING_EXPENSES_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_EXPENSES_MSW_HANDLERS);
/**
 * Performs the setup accounting expenses mock server operation within accounting expenses; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingExpensesMockServer(): void {
  beforeAll(() => ACCOUNTING_EXPENSES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_EXPENSES_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_EXPENSES_MOCK_SERVER.close());
}
