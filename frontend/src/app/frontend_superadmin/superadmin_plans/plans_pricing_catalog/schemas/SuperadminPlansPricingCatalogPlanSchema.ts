// FLOW: Feature form/API boundary -> superadmin_plans/plans_pricing_catalog/schemas/SuperadminPlansPricingCatalogPlanSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Subscriptions Plan Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

export const SUPERADMIN_SUBSCRIPTIONS_PLAN_SCHEMA = z.object({
  name: z.string({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PLAN_NAME_IS_REQUIRED").max(60, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PLAN_NAME_MUST_BE_60_CHARACTERS_OR_FEWER"),
  price: z.number({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_NUMBER" }).finite("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_PRICE").positive("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_MUST_BE_GREATER_THAN_ZERO").max(1_000_000, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_EXCEEDS_THE_ALLOWED_PREVIEW_LIMIT"),
  priceHalfYearly: z.number({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_NUMBER" }).finite("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_PRICE").positive("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_MUST_BE_GREATER_THAN_ZERO").max(5_000_000, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_EXCEEDS_THE_ALLOWED_PREVIEW_LIMIT").optional(),
  priceAnnual: z.number({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_NUMBER" }).finite("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_PRICE").positive("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_MUST_BE_GREATER_THAN_ZERO").max(10_000_000, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PRICE_EXCEEDS_THE_ALLOWED_PREVIEW_LIMIT").optional(),
  branches: z.number({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_NUMBER" }).int("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.BRANCH_LIMIT_MUST_BE_A_WHOLE_NUMBER").min(1, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.AT_LEAST_ONE_BRANCH_IS_REQUIRED").max(10_000, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.BRANCH_LIMIT_EXCEEDS_THE_PREVIEW_LIMIT"),
  members: z.number({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_NUMBER" }).int("SUPERADMIN_SUBSCRIPTIONS.VALIDATION.MEMBER_LIMIT_MUST_BE_A_WHOLE_NUMBER").min(1, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.AT_LEAST_ONE_MEMBER_IS_REQUIRED").max(10_000_000, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.MEMBER_LIMIT_EXCEEDS_THE_PREVIEW_LIMIT"),
  storage: z.string({ message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(40, "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.STORAGE_LIMIT_MUST_BE_40_CHARACTERS_OR_FEWER").optional(),
  adminUsers: z.number().int().min(1).max(1000).optional(),
  staffUsers: z.number().int().min(1).max(5000).optional(),
  smsCredits: z.number().int().min(0).max(1_000_000).optional(),
  whatsappCredits: z.number().int().min(0).max(1_000_000).optional(),
  apiAccess: z.boolean().optional(),
  exportAccess: z.boolean().optional(),
  advancedReports: z.boolean().optional(),
  backupPolicy: z.enum(['Daily', 'Weekly', 'Realtime']).optional(),
  supportLevel: z.enum(['Standard', 'Priority', 'Dedicated 24/7']).optional(),
  freeTrial: z.boolean().optional(),
  trialDays: z.number().int().min(0).max(90).optional(),
  tierType: z.enum(['Starter', 'Professional', 'Enterprise', 'Custom']).optional(),
}, { message: "SUPERADMIN_SUBSCRIPTIONS.VALIDATION.PROVIDE_VALID_FORM_DATA" });
