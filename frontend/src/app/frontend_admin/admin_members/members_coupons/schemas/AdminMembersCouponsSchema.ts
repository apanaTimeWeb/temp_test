import { format, isValid, parseISO } from 'date-fns';
import { z } from 'zod';
import { ADMIN_COUPONS_STATUS_VALUES, ADMIN_COUPONS_UNKNOWN_STATUS } from '@/app/frontend_admin/admin_members/members_coupons/config/admin_members_coupons.url_config';
import type { AdminCouponsCouponAmountUnit, AdminCouponsFormValuesType } from '@/app/frontend_admin/admin_members/members_coupons/types/AdminMembersCouponsComponentTypes';



export const AdminCouponsApiRecordSchema = z.object({
  id: z.union([z.string(), z.number()]),
  code: z.string(),
  discountValue: z.number().finite().positive(),
  discountType: z.string(),
  currencyCode: z.string().regex(/^[A-Z]{3}$/).optional(),
  amountUnit: z.enum(['minor', 'major']).optional(),
  usedCount: z.number().optional(),
  maxUses: z.number().optional(),
  validUntil: z.string().optional().refine((value) => value === undefined || isValidAdminCouponsCalendarDate(value), 'Expected a valid calendar expiry date'),
  isActive: z.boolean().optional(),
  status: z.string().optional(),
}).passthrough().superRefine((record, context) => {
  const discountType = record.discountType.trim().toLowerCase();
  if ((discountType === 'percent' || discountType === 'percentage') && record.discountValue > 100) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['discountValue'], message: 'Percentage discount cannot exceed 100%' });
  }
});

export const AdminCouponsApiResponseSchema = z.array(AdminCouponsApiRecordSchema);

/** Validates ISO calendar-day values without accepting JavaScript Date rollover. */
export function isValidAdminCouponsCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = parseISO(value);
  return isValid(parsed) && format(parsed, 'yyyy-MM-dd') === value;
}

export interface AdminCouponsValidationMessages {
  codeRequired: string;
  discountPositive: string;
  discountPercentMax: string;
  typeRequired: string;
  maxUsesPositive: string;
  expiryRequired: string;
  expiryInvalid: string;
}

const DEFAULT_VALIDATION_MESSAGES: AdminCouponsValidationMessages = {
  codeRequired: 'Coupon code is required',
  discountPositive: 'Discount must be greater than zero',
  discountPercentMax: 'Percentage discount cannot exceed 100%',
  typeRequired: 'Select a discount type',
  maxUsesPositive: 'Maximum uses must be a positive whole number',
  expiryRequired: 'Expiry date is required',
  expiryInvalid: 'Enter a valid calendar date',
};

export function createAdminCouponsFormSchema(messages: AdminCouponsValidationMessages = DEFAULT_VALIDATION_MESSAGES) {
  return z.object({
    code: z.string().trim().min(1, messages.codeRequired),
    discount: z.coerce.number().finite().positive(messages.discountPositive),
    type: z.enum(['Flat', 'Percent'], { message: messages.typeRequired }),
    maxUses: z.coerce.number().int(messages.maxUsesPositive).positive(messages.maxUsesPositive),
    expiry: z.string().min(1, messages.expiryRequired).refine(isValidAdminCouponsCalendarDate, messages.expiryInvalid),
  }).superRefine((draft, context) => {
    if (draft.type === 'Percent' && draft.discount > 100) context.addIssue({ code: z.ZodIssueCode.custom, path: ['discount'], message: messages.discountPercentMax });
  });
}

export const AdminCouponsFormSchema = createAdminCouponsFormSchema();

/** Fully validated values returned by the coupon form schema (numeric discount/max uses). */
export type AdminCouponsFormOutput = z.infer<ReturnType<typeof createAdminCouponsFormSchema>>;


// Domain response/form types co-located with their runtime Zod contracts.

export type AdminCouponsDiscountType = 'Flat' | 'Percent' | 'Unknown';
export type AdminCouponsStatus = (typeof ADMIN_COUPONS_STATUS_VALUES)[number] | typeof ADMIN_COUPONS_UNKNOWN_STATUS;
export interface AdminCouponsCoupon { id: string; code: string; discount: number; type: AdminCouponsDiscountType; currencyCode?: string; amountUnit?: AdminCouponsCouponAmountUnit; usedCount?: number; maxUses?: number; expiry?: string; status: AdminCouponsStatus; }
export interface AdminCouponsFormValues { code: string; discount: string; type: AdminCouponsFormValuesType; maxUses: string; expiry: string; }
