// FLOW: Feature source -> superadmin_accounting/accounting_expense_categories/types/superadmin_accounting_expense_categories.types.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Expense Category Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminAccountingExpenseCategoryColor = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

/**
 * Defines the public SuperadminAccountingExpenseCategory contract for accounting expense categories. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: string.
 * @property name Display label for the owning feature. Declared type: string.
 * @property budget Value defined by the existing feature-local contract. Declared type: number.
 * @property spent Value defined by the existing feature-local contract. Declared type: number.
 * @property color Value defined by the existing feature-local contract. Declared type: SuperadminAccountingExpenseCategoryColor.
 */
export interface SuperadminAccountingExpenseCategory { id: string; name: string; budget: number; spent: number; color: SuperadminAccountingExpenseCategoryColor; }
