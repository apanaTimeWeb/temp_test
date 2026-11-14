// RESPONSIBILITY: Define stable module-owned constants for accounting expense categories; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_accounting/accounting_expense_categories/constants/SuperadminAccountingExpenseCategoriesExpenseCategoryConstants.ts -> typed constants -> component/hook/config behavior.
/** Static, presentation-only options for the accounting expense category preview. */
export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS = ['primary', 'success', 'warning', 'danger', 'info', 'purple'] as const;

export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLOR_CLASSES: Record<(typeof SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS)[number], string> = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  purple: 'bg-purple-bg',
};
