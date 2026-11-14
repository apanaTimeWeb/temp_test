// FLOW: Feature source -> superadmin_accounting/accounting_expenses/types/SuperadminAccountingExpensesExpenseTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Superadmin Accounting Expense Types; defines module-owned type contracts for the named data boundary. */
export type SuperadminAccountingPaymentMode = 'cash' | 'upi' | 'card' | 'bank';

/**
 * Defines the public SuperadminAccountingExpense contract for accounting expenses. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 * @property id Stable identifier for the associated record. Declared type: number.
 * @property date Timestamp or date value in the declared type; formatting is handled by the owning view. Declared type: string.
 * @property category Value defined by the existing feature-local contract. Declared type: string.
 * @property description Value defined by the existing feature-local contract. Declared type: string.
 * @property amount Monetary or numeric value with units and currency semantics defined by the declared type. Declared type: number.
 * @property paidBy Value defined by the existing feature-local contract. Declared type: string.
 * @property mode Value defined by the existing feature-local contract. Declared type: SuperadminAccountingPaymentMode.
 */
export interface SuperadminAccountingExpense {
  id: number; date: string; category: string; description: string; amount: number; paidBy: string; mode: SuperadminAccountingPaymentMode;
}
