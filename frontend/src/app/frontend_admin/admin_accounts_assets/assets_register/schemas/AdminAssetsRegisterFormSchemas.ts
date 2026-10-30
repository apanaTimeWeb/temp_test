import { z } from 'zod';
import type { AdminAssetsRegisterAssetStatus } from '@/app/frontend_admin/admin_accounts_assets/assets_register/types/AdminAssetsRegisterComponentTypes';


export type AdminAssetsRegisterValidationKey =
  | 'VALIDATION_NAME_REQUIRED'
  | 'VALIDATION_CATEGORY_REQUIRED'
  | 'VALIDATION_DATE_REQUIRED'
  | 'VALIDATION_VALUE_POSITIVE'
  | 'VALIDATION_LOCATION_REQUIRED';
export type AdminAssetsRegisterTranslate = (key: AdminAssetsRegisterValidationKey) => string;

function isAdminAssetsRegisterValidCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

/** Validates user-entered INR major units; the asset row stores integer paise. */
export function createAdminAssetsRegisterFormSchema(t: AdminAssetsRegisterTranslate) {
  return z.object({
    name: z.string().trim().min(1, t('VALIDATION_NAME_REQUIRED')),
    category: z.enum(['Appliance', 'Security', 'Furniture', 'Electronics', 'Other'], { errorMap: () => ({ message: t('VALIDATION_CATEGORY_REQUIRED') }) }),
    purchaseDate: z.string().min(1, t('VALIDATION_DATE_REQUIRED')).refine(isAdminAssetsRegisterValidCalendarDate, 'Purchase date must be a valid calendar date.'),
    purchaseValue: z.coerce.number().finite().positive(t('VALIDATION_VALUE_POSITIVE'))
      .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-7, t('VALIDATION_VALUE_POSITIVE')),
    location: z.string().trim().min(1, t('VALIDATION_LOCATION_REQUIRED')),
  });
}

export const AdminAssetsRegisterFormSchema = createAdminAssetsRegisterFormSchema((key) => ({
  VALIDATION_NAME_REQUIRED: 'Asset name is required.',
  VALIDATION_CATEGORY_REQUIRED: 'Select a category.',
  VALIDATION_DATE_REQUIRED: 'Select a purchase date.',
  VALIDATION_VALUE_POSITIVE: 'Purchase value must be greater than zero and use at most two decimal places.',
  VALIDATION_LOCATION_REQUIRED: 'Enter the asset location.',
}[key]));
export type AdminAssetsRegisterFormValues = z.infer<typeof AdminAssetsRegisterFormSchema>;

/** Asset-register row shape. Monetary amounts use integer INR paise. */
export interface AdminAssetsRegisterAsset {
  id: number;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseValue: number;
  currentValue: number;
  location: string;
  status: AdminAssetsRegisterAssetStatus;
}
