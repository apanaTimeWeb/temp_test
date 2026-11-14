// RESPONSIBILITY: Provide the isolated feature-local test harness entrypoint.
// FLOW: Feature test -> harness bootstrap/provider -> owning leaf-local mocks and providers.
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_MSW_HANDLERS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/mocks/handlers/SuperadminAccountingExpenseCategoriesMockHandlers';

/** Isolated MSW lifecycle for accounting_expense_categories; tests opt in by calling setupAccountingExpenseCategoriesMockServer(). */
export const ACCOUNTING_EXPENSE_CATEGORIES_MOCK_SERVER = setupServer(...SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_MSW_HANDLERS);
/**
 * Performs the setup accounting expense categories mock server operation within accounting expense categories; inputs and outputs follow the declared TypeScript contract.
 * @returns The declared result for this operation. Declared type: void.
 */
export function setupAccountingExpenseCategoriesMockServer(): void {
  beforeAll(() => ACCOUNTING_EXPENSE_CATEGORIES_MOCK_SERVER.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => ACCOUNTING_EXPENSE_CATEGORIES_MOCK_SERVER.resetHandlers());
  afterAll(() => ACCOUNTING_EXPENSE_CATEGORIES_MOCK_SERVER.close());
}
