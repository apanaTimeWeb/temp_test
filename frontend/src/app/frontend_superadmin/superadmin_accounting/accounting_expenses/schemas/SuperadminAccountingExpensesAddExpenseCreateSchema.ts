// FLOW: Feature form/API boundary -> superadmin_accounting/accounting_expenses/schemas/SuperadminAccountingExpensesAddExpenseCreateSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Accounting Expense Create Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_CATEGORIES = [
  'Electricity', 'Maintenance', 'Stationery', 'Internet', 'Cleaning', 'Salary', 'Rent', 'Miscellaneous',
] as const;
export const SUPERADMIN_ACCOUNTING_EXPENSE_PAYMENT_MODES = ['cash', 'upi', 'card', 'bank'] as const;

export const SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_SCHEMA = z.object({
  date: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.CHOOSE_AN_EXPENSE_DATE"),
  category: z.enum(SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_CATEGORIES, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }),
  description: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_DESCRIPTION").max(160, "SUPERADMIN_ACCOUNTING.VALIDATION.DESCRIPTION_MUST_BE_160_CHARACTERS_OR_FEWER"),
  amount: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_AN_AMOUNT").refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, "SUPERADMIN_ACCOUNTING.VALIDATION.AMOUNT_MUST_BE_A_POSITIVE_NUMBER"),
  paidBy: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_WHO_PAID_THE_EXPENSE").max(100, "SUPERADMIN_ACCOUNTING.VALIDATION.NAME_MUST_BE_100_CHARACTERS_OR_FEWER"),
  mode: z.enum(SUPERADMIN_ACCOUNTING_EXPENSE_PAYMENT_MODES, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }),
  notes: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).max(500, "SUPERADMIN_ACCOUNTING.VALIDATION.NOTES_MUST_BE_500_CHARACTERS_OR_FEWER"),
}, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminAccountingExpenseCreateFormValues contract for accounting expenses. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingExpenseCreateFormValues = z.infer<typeof SUPERADMIN_ACCOUNTING_EXPENSE_CREATE_SCHEMA>;
