// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_EXPENSES_ADD_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/mocks/handlers/SuperadminAccountingExpensesAddMockHandlers';

/** Isolated MSW lifecycle for accounting_expenses_add; tests opt in by calling setupAccountingExpensesAddMockServer(). */
export const ACCOUNTING_EXPENSES_ADD_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_EXPENSES_ADD_MSW_HANDLERS);
/**
 * Performs the setup accounting expenses add mock server operation within accounting expenses; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingExpensesAddMockServer(): void {
  beforeAll(() => ACCOUNTING_EXPENSES_ADD_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_EXPENSES_ADD_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_EXPENSES_ADD_MOCK_SERVER.close());
}
