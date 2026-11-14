// RESPONSIBILITY: Define source-level test coverage for accounting expense categories using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expense_categories/tests/SuperadminAccountingExpenseCategoriesHarness.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_ROUTES as __SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_ROUTES } from "@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/config/superadmin_accounting_expense_categories.url_config";
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_QUERY_KEYS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/api/superadmin_accounting_expense_categories.query_keys';

describe('accounting_expense_categories standalone contract', () => {
  it('keeps the public route inside its owning domain', () => {
    expect(__SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_ROUTES.SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_URLS.PAGE).toContain('/superadmin/superadmin_accounting');
    expect(__SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_ROUTES.SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_URLS.SCREEN).toBe("/superadmin/superadmin_accounting/accounting_expense_categories");
  });
  it('uses an isolated query-key namespace', () => {
    expect(SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES_QUERY_KEYS.all).toEqual(["superadmin", "superadmin_accounting", "accounting_expense_categories"]);
  });
});
