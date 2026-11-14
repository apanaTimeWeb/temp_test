// FLOW: Feature form/API boundary -> superadmin_accounting/accounting_expense_categories/schemas/superadmin_accounting_expense_categories.schemas.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Accounting Expense Category Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';
import { SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expense_categories/constants/superadmin_accounting_expense_categories.constants';

export const SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_SCHEMA = z.object({
  name: z.string({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_CATEGORY_NAME").max(80, "SUPERADMIN_ACCOUNTING.VALIDATION.CATEGORY_NAME_MUST_BE_80_CHARACTERS_OR_FEWER"),
  budget: z.number({ error: "SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_NUMBER" }).finite("SUPERADMIN_ACCOUNTING.VALIDATION.ENTER_A_VALID_BUDGET").positive("SUPERADMIN_ACCOUNTING.VALIDATION.BUDGET_MUST_BE_GREATER_THAN_ZERO"),
  color: z.enum(SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.SELECT_A_VALID_OPTION" }),
}, { error: "SUPERADMIN_ACCOUNTING.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminAccountingExpenseCategoryFormValues contract for accounting expense categories. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminAccountingExpenseCategoryFormValues = z.infer<typeof SUPERADMIN_ACCOUNTING_EXPENSE_CATEGORY_SCHEMA>;
