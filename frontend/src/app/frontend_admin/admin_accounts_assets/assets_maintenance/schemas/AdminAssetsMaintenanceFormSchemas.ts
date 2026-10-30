import { z } from 'zod';
import { ADMIN_ACCOUNTING_EXPENSE_CATEGORY_COLORS } from '@/app/frontend_admin/admin_accounts_assets/assets_maintenance/config/admin_assets_maintenance.url_config';

export type AdminAccountingAssetValidationKey =
  | 'VALIDATION_NAME_REQUIRED'
  | 'VALIDATION_CATEGORY_REQUIRED'
  | 'VALIDATION_DATE_REQUIRED'
  | 'VALIDATION_VALUE_POSITIVE'
  | 'VALIDATION_LOCATION_REQUIRED';
export type AdminAccountingAssetTranslate = (key: AdminAccountingAssetValidationKey) => string;

const ADMIN_ACCOUNTING_ASSET_VALIDATION_ENGLISH: Record<AdminAccountingAssetValidationKey, string> = {
  VALIDATION_NAME_REQUIRED: 'Asset name is required.',
  VALIDATION_CATEGORY_REQUIRED: 'Select a category.',
  VALIDATION_DATE_REQUIRED: 'Select a purchase date.',
  VALIDATION_VALUE_POSITIVE: 'Purchase value must be greater than zero.',
  VALIDATION_LOCATION_REQUIRED: 'Enter the asset location.',
};

export function createAdminAccountingAssetFormSchema(t: AdminAccountingAssetTranslate) {
  return z.object({
    name: z.string().trim().min(1, t('VALIDATION_NAME_REQUIRED')),
    category: z.string().trim().min(1, t('VALIDATION_CATEGORY_REQUIRED')),
    purchaseDate: z.string().min(1, t('VALIDATION_DATE_REQUIRED')),
    purchaseValue: z.coerce.number().positive(t('VALIDATION_VALUE_POSITIVE')),
    location: z.string().trim().min(1, t('VALIDATION_LOCATION_REQUIRED')),
  });
}

export const AdminAccountingAssetFormSchema = createAdminAccountingAssetFormSchema((key) => ADMIN_ACCOUNTING_ASSET_VALIDATION_ENGLISH[key]);
export type AdminAccountingAssetFormValues = z.infer<typeof AdminAccountingAssetFormSchema>;

export type AdminAccountingMaintenanceValidationKey =
  | 'VALIDATION_ASSET_REQUIRED'
  | 'VALIDATION_ISSUE_REQUIRED'
  | 'VALIDATION_REPORTED_REQUIRED'
  | 'VALIDATION_SCHEDULED_REQUIRED'
  | 'VALIDATION_COST_NONNEGATIVE';
export type AdminAccountingMaintenanceTranslate = (key: AdminAccountingMaintenanceValidationKey) => string;

const ADMIN_ACCOUNTING_MAINTENANCE_VALIDATION_ENGLISH: Record<AdminAccountingMaintenanceValidationKey, string> = {
  VALIDATION_ASSET_REQUIRED: 'Asset name is required.',
  VALIDATION_ISSUE_REQUIRED: 'Issue description is required.',
  VALIDATION_REPORTED_REQUIRED: 'Reported date is required.',
  VALIDATION_SCHEDULED_REQUIRED: 'Scheduled date is required.',
  VALIDATION_COST_NONNEGATIVE: 'Cost cannot be negative.',
};

export function createAdminAccountingMaintenanceFormSchema(t: AdminAccountingMaintenanceTranslate) {
  return z.object({
    assetName: z.string().trim().min(1, t('VALIDATION_ASSET_REQUIRED')),
    issue: z.string().trim().min(1, t('VALIDATION_ISSUE_REQUIRED')),
    reportedDate: z.string().min(1, t('VALIDATION_REPORTED_REQUIRED')),
    scheduledDate: z.string().min(1, t('VALIDATION_SCHEDULED_REQUIRED')),
    vendor: z.string().trim(),
    cost: z.coerce.number().finite().nonnegative(t('VALIDATION_COST_NONNEGATIVE')),
  });
}

export const AdminAccountingMaintenanceFormSchema = createAdminAccountingMaintenanceFormSchema((key) => ADMIN_ACCOUNTING_MAINTENANCE_VALIDATION_ENGLISH[key]);
export type AdminAccountingMaintenanceFormValues = z.infer<typeof AdminAccountingMaintenanceFormSchema>;

export type AdminAccountingExpenseCategoryValidationKey = 'VALIDATION_NAME_REQUIRED' | 'VALIDATION_BUDGET_NONNEGATIVE';
export type AdminAccountingExpenseCategoryTranslate = (key: AdminAccountingExpenseCategoryValidationKey) => string;

const ADMIN_ACCOUNTING_EXPENSE_CATEGORY_VALIDATION_ENGLISH: Record<AdminAccountingExpenseCategoryValidationKey, string> = {
  VALIDATION_NAME_REQUIRED: 'Category name is required.',
  VALIDATION_BUDGET_NONNEGATIVE: 'Budget cannot be negative.',
};

export function createAdminAccountingExpenseCategoryFormSchema(t: AdminAccountingExpenseCategoryTranslate) {
  return z.object({
    name: z.string().trim().min(1, t('VALIDATION_NAME_REQUIRED')),
    budget: z.coerce.number().nonnegative(t('VALIDATION_BUDGET_NONNEGATIVE')),
  });
}

export const AdminAccountingExpenseCategoryFormSchema = createAdminAccountingExpenseCategoryFormSchema((key) => ADMIN_ACCOUNTING_EXPENSE_CATEGORY_VALIDATION_ENGLISH[key]);
export type AdminAccountingExpenseCategoryFormValues = z.infer<typeof AdminAccountingExpenseCategoryFormSchema>;

export type AdminAccountingExpenseValidationKey = 'VALIDATION_DATE_REQUIRED' | 'VALIDATION_CATEGORY_REQUIRED' | 'VALIDATION_DESCRIPTION_REQUIRED' | 'VALIDATION_AMOUNT_POSITIVE' | 'VALIDATION_PAID_BY_REQUIRED';
export type AdminAccountingExpenseTranslate = (key: AdminAccountingExpenseValidationKey) => string;

const ADMIN_ACCOUNTING_EXPENSE_VALIDATION_ENGLISH: Record<AdminAccountingExpenseValidationKey, string> = {
  VALIDATION_DATE_REQUIRED: 'Date is required.',
  VALIDATION_CATEGORY_REQUIRED: 'Category is required.',
  VALIDATION_DESCRIPTION_REQUIRED: 'Description is required.',
  VALIDATION_AMOUNT_POSITIVE: 'Amount must be greater than zero.',
  VALIDATION_PAID_BY_REQUIRED: 'Paid by is required.',
};

export function createAdminAccountingExpenseFormSchema(t: AdminAccountingExpenseTranslate) {
  return z.object({
    date: z.string().min(1, t('VALIDATION_DATE_REQUIRED')),
    category: z.string().min(1, t('VALIDATION_CATEGORY_REQUIRED')),
    description: z.string().trim().min(1, t('VALIDATION_DESCRIPTION_REQUIRED')),
    amount: z.coerce.number().positive(t('VALIDATION_AMOUNT_POSITIVE')),
    paidBy: z.string().trim().min(1, t('VALIDATION_PAID_BY_REQUIRED')),
    mode: z.enum(['cash', 'upi', 'card', 'bank']),
    notes: z.string().trim(),
  });
}

export const AdminAccountingExpenseFormSchema = createAdminAccountingExpenseFormSchema((key) => ADMIN_ACCOUNTING_EXPENSE_VALIDATION_ENGLISH[key]);
export type AdminAccountingExpenseFormValues = z.infer<typeof AdminAccountingExpenseFormSchema>;


/** Runtime validation for browser-only demo storage; persisted data is untrusted input. */
export const AdminAccountingExpenseRecordSchema = z.object({
  id: z.number().int().nonnegative(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format'),
  category: z.string().min(1),
  description: z.string(),
  amount: z.number().finite().nonnegative(),
  paidBy: z.string(),
  mode: z.enum(['cash', 'upi', 'card', 'bank']),
  notes: z.string(),
});
export const AdminAccountingExpenseRecordsSchema = z.array(AdminAccountingExpenseRecordSchema);
