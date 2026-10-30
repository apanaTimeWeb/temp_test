import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import type { AdminPlansStatus } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import { z } from 'zod';
import type { AdminPlansPlanAmountUnit } from '@/app/frontend_admin/admin_members/members_plans/types/AdminMembersPlansComponentTypes';


const AdminPlansApiPlanSchema = z.object({
  id: z.union([z.string().trim().min(1), z.number().finite()]),
  name: z.string().trim().min(1).max(120),
  // Currency identity and major/minor unit are not defined by the supplied API contract (ISSUE-059).
  price: z.number().finite().nonnegative(),
  currencyCode: z.string().regex(/^[A-Z]{3}$/).optional(),
  amountUnit: z.enum(['minor', 'major']).optional(),
  durationInDays: z.number().int().positive().safe(),
  features: z.array(z.string().trim().min(1)).optional(),
  isActive: z.boolean().optional(),
  status: z.enum(ADMIN_PLANS_STATUS_VALUES).optional(),
  subscribers: z.number().int().nonnegative().safe().optional(),
}).passthrough();

export const AdminPlansApiResponseSchema = z.array(AdminPlansApiPlanSchema);

/**
 * Frontend-only validation for the Admin Plans form.
 * The schema validates user-entered plan drafts; persistence is owned by the page and only simulated in explicit local demo mode.
 */
export const AdminPlansFormSchema = z.object({
  name: z.string().trim().min(2, 'VALIDATION.NAME_TOO_SHORT').max(80, 'VALIDATION.NAME_TOO_LONG'),
  price: z.string().trim()
    .min(1, 'VALIDATION.PRICE_REQUIRED')
    .refine((value) => value.length > 0 && Number.isFinite(Number(value)) && Number(value) >= 0, 'VALIDATION.PRICE_INVALID'),
  duration: z.string().trim().min(1, 'VALIDATION.DURATION_REQUIRED').max(40, 'VALIDATION.DURATION_TOO_LONG'),
  durationDays: z.string().trim()
    .min(1, 'VALIDATION.DURATION_DAYS_REQUIRED')
    .refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number.isSafeInteger(Number(value)), 'VALIDATION.DURATION_DAYS_INVALID'),
  features: z.string().max(4000, 'VALIDATION.FEATURES_TOO_LONG'),
});

export type AdminPlansFormValues = z.infer<typeof AdminPlansFormSchema>;


// API/domain record type adjacent to its canonical Zod schema.


export interface AdminPlansPlan {
  id: string;
  name: string;
  price: number;
  currencyCode?: string;
  amountUnit?: AdminPlansPlanAmountUnit;
  duration: string;
  durationDays: number;
  features: string[];
  status: AdminPlansStatus;
  subscribers: number;
}
