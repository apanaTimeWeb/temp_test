// RESPONSIBILITY: Define source-level test coverage for accounting expenses using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expenses/tests/SuperadminAccountingExpensesAddHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES as __SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES } from "@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/config/superadmin_accounting_expenses.url_config";
import { SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/api/superadmin_accounting_expenses_add.query_keys';

describe('accounting_expenses_add standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES.SUPERADMIN_ACCOUNTING_EXPENSES_ADD_URLS.PAGE).toContain('/superadmin/superadmin_accounting');
    expect(__SUPERADMIN_ACCOUNTING_EXPENSES_ROUTES.SUPERADMIN_ACCOUNTING_EXPENSES_ADD_URLS.SCREEN).toBe("/superadmin/superadmin_accounting/accounting_expenses?view=create");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ACCOUNTING_EXPENSES_ADD_QUERY_KEYS.all[0]).toBe('superadmin_accounting_expenses_add');
  });
});
