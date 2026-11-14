// RESPONSIBILITY: Define local sample fixtures for accounting expense categories; sample data does not represent live customer or backend records.
// FLOW: Feature preview/test -> superadmin_accounting/accounting_expense_categories/mocks/fixtures/SuperadminAccountingExpenseCategoriesExpenseCategoryMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
import type { SuperadminAccountingExpenseCategory } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/types/superadmin_accounting_expense_categories.types';

/** Illustrative budget/expense categories for browser-only preview. */
export const SUPERADMIN_ACCOUNTING_SAMPLE_EXPENSE_CATEGORIES: readonly SuperadminAccountingExpenseCategory[] = [
  { id: 'sample-electricity', name: 'Electricity', budget: 5000, spent: 4200, color: 'warning' },
  { id: 'sample-maintenance', name: 'Maintenance', budget: 4000, spent: 3600, color: 'danger' },
  { id: 'sample-internet', name: 'Internet', budget: 2500, spent: 2200, color: 'info' },
  { id: 'sample-salary', name: 'Salary', budget: 15000, spent: 12000, color: 'primary' },
  { id: 'sample-stationery', name: 'Stationery', budget: 1000, spent: 650, color: 'success' },
  { id: 'sample-cleaning', name: 'Cleaning', budget: 1200, spent: 900, color: 'purple' },
];
