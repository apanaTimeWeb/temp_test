/** Module-owned allowed values for the local expense draft UI. These are not an API contract. */
export const MANAGER_ACCOUNTING_EXPENSE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Salary', 'Rent', 'Miscellaneous',
] as const;

export const MANAGER_ACCOUNTING_PAYMENT_MODES = ['cash', 'upi', 'card', 'bank'] as const;

export type ManagerAccountsExpensesExpenseCategory = (typeof MANAGER_ACCOUNTING_EXPENSE_CATEGORIES)[number];
export type ManagerAccountsExpensesPaymentMode = (typeof MANAGER_ACCOUNTING_PAYMENT_MODES)[number];
