import { z } from 'zod';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORIES } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/config/admin_accounts_expenses.url_config';

export type AdminAccountingExpenseCategoryValidationKey = 'VALIDATION_NAME_REQUIRED' | 'VALIDATION_BUDGET_NONNEGATIVE';
export type AdminAccountingExpenseCategoryTranslate = (key: AdminAccountingExpenseCategoryValidationKey) => string;

const ADMIN_ACCOUNTING_EXPENSE_CATEGORY_VALIDATION_ENGLISH: Record<AdminAccountingExpenseCategoryValidationKey, string> = {
  VALIDATION_NAME_REQUIRED: 'Category name is required.',
  VALIDATION_BUDGET_NONNEGATIVE: 'Budget cannot be negative.',
};

/** Validation for the expense-category form contract; the category management UI remains in its own module. */
export function createAdminAccountingExpenseCategoryFormSchema(t: AdminAccountingExpenseCategoryTranslate) {
  return z.object({
    name: z.string().trim().min(1, t('VALIDATION_NAME_REQUIRED')),
    budget: z.coerce.number().finite().nonnegative(t('VALIDATION_BUDGET_NONNEGATIVE')),
  });
}

export const AdminAccountingExpenseCategoryFormSchema = createAdminAccountingExpenseCategoryFormSchema((key) => ADMIN_ACCOUNTING_EXPENSE_CATEGORY_VALIDATION_ENGLISH[key]);
export type AdminAccountingExpenseCategoryFormValues = z.infer<typeof AdminAccountingExpenseCategoryFormSchema>;

export type AdminAccountingExpenseValidationKey =
  | 'VALIDATION_DATE_REQUIRED'
  | 'VALIDATION_CATEGORY_REQUIRED'
  | 'VALIDATION_DESCRIPTION_REQUIRED'
  | 'VALIDATION_AMOUNT_POSITIVE'
  | 'VALIDATION_PAID_BY_REQUIRED';
export type AdminAccountingExpenseTranslate = (key: AdminAccountingExpenseValidationKey) => string;

const ADMIN_ACCOUNTING_EXPENSE_VALIDATION_ENGLISH: Record<AdminAccountingExpenseValidationKey, string> = {
  VALIDATION_DATE_REQUIRED: 'Date is required.',
  VALIDATION_CATEGORY_REQUIRED: 'Category is required.',
  VALIDATION_DESCRIPTION_REQUIRED: 'Description is required.',
  VALIDATION_AMOUNT_POSITIVE: 'Amount must be greater than zero and use at most two decimal places.',
  VALIDATION_PAID_BY_REQUIRED: 'Paid by is required.',
};

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Validates a user-entered INR amount in major units before conversion to integer paise. */
export function createAdminAccountingExpenseFormSchema(t: AdminAccountingExpenseTranslate) {
  return z.object({
    date: z.string().min(1, t('VALIDATION_DATE_REQUIRED')).refine(isValidIsoDate, 'Date must be a valid calendar date.'),
    category: z.enum(ADMIN_ACCOUNTING_EXPENSE_CATEGORIES, { errorMap: () => ({ message: t('VALIDATION_CATEGORY_REQUIRED') }) }),
    description: z.string().trim().min(1, t('VALIDATION_DESCRIPTION_REQUIRED')),
    amount: z.coerce.number()
      .finite()
      .positive(t('VALIDATION_AMOUNT_POSITIVE'))
      .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, t('VALIDATION_AMOUNT_POSITIVE')),
    paidBy: z.string().trim().min(1, t('VALIDATION_PAID_BY_REQUIRED')),
    mode: z.enum(['cash', 'upi', 'card', 'bank']),
    notes: z.string().trim(),
  });
}

export const AdminAccountingExpenseFormSchema = createAdminAccountingExpenseFormSchema((key) => ADMIN_ACCOUNTING_EXPENSE_VALIDATION_ENGLISH[key]);
export type AdminAccountingExpenseFormValues = z.infer<typeof AdminAccountingExpenseFormSchema>;

/** Runtime validation for transient demo-state records; domain records are never persisted in browser storage. */
export const AdminAccountingExpenseRecordSchema = z.object({
  id: z.number().int().positive(),
  date: z.string().refine(isValidIsoDate, 'Date must be a valid calendar date.'),
  category: z.enum(ADMIN_ACCOUNTING_EXPENSE_CATEGORIES),
  description: z.string().trim().min(1),
  amount: z.number().int().positive(),
  paidBy: z.string().trim().min(1),
  mode: z.enum(['cash', 'upi', 'card', 'bank']),
  notes: z.string(),
});
export const AdminAccountingExpenseRecordsSchema = z.array(AdminAccountingExpenseRecordSchema);
export type AdminAccountingExpense = z.infer<typeof AdminAccountingExpenseRecordSchema>;
