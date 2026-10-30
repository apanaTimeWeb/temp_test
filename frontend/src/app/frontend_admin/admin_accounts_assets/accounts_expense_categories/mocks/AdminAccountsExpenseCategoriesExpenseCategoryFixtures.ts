import type { AdminAccountingExpenseCategory } from '@/app/frontend_admin/admin_accounts_assets/accounts_expense_categories/types/AdminAccountsExpenseCategoriesTypes';

export const ADMIN_ACCOUNTING_EXPENSE_CATEGORY_FIXTURES: readonly AdminAccountingExpenseCategory[] = [
  { id: 1, name: 'Electricity', budget: 2500000, spent: 1800000, color: 'warning' },
  { id: 2, name: 'Maintenance', budget: 1500000, spent: 720000, color: 'danger' },
  { id: 3, name: 'Cleaning', budget: 1000000, spent: 640000, color: 'success' },
  { id: 4, name: 'Salaries', budget: 12000000, spent: 11800000, color: 'primary' },
];
