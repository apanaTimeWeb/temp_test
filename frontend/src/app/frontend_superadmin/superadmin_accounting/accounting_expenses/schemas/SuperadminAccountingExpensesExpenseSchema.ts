// FLOW: Feature form/API boundary -> superadmin_accounting/accounting_expenses/schemas/SuperadminAccountingExpensesExpenseSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Accounting Expense Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning',
  'Miscellaneous', 'Rent', 'Salary',
] as const;

export const SuperadminAccountingExpenseSchema = z.object({
  date: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.CHOOSE_AN_EXPENSE_DATE"),
  category: z.enum(SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORIES, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }),
  description: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_DESCRIPTION").max(160, "SUPERADMIN_ACCOUNTING.VALIDATION.DESCRIPTION_MUST_BE_160_CHARACTERS_OR_FEWER"),
  amount: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_AN_AMOUNT").refine(value => Number.isFinite(Number(value)) && Number(value) > 0, "SUPERADMIN_ACCOUNTING.VALIDATION.AMOUNT_MUST_BE_A_POSITIVE_NUMBER"),
  paidBy: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_WHO_PAID_THE_EXPENSE").max(100, "SUPERADMIN_ACCOUNTING.VALIDATION.NAME_MUST_BE_100_CHARACTERS_OR_FEWER"),
  mode: z.enum(['cash', 'upi', 'card', 'bank'], { error: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }),
}, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminAccountingExpenseFormValues contract for accounting expenses. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingExpenseFormValues = z.infer<typeof SuperadminAccountingExpenseSchema>;
