// FLOW: Feature form/API boundary -> superadmin_plans/plans_promotions/schemas/SuperadminPlansPromotionsPromoSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Billing Promo Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminBillingPromoExpirySchema = z.string({ error: "SUPERADMIN_BILLING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^\d{4}-\d{2}-\d{2}$/, "SUPERADMIN_BILLING.VALIDATION.CHOOSE_AN_EXPIRY_DATE").refine((value) => {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, "SUPERADMIN_BILLING.VALIDATION.ENTER_A_VALID_CALENDAR_DATE");

export const SuperadminBillingPromoSchema = z.object({
  code: z.string({ error: "SUPERADMIN_BILLING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(3, "SUPERADMIN_BILLING.VALIDATION.USE_AT_LEAST_3_CHARACTERS").max(32, "SUPERADMIN_BILLING.VALIDATION.USE_AT_MOST_32_CHARACTERS")
    .transform((value) => value.toUpperCase())
    .pipe(z.string().regex(/^[A-Z0-9][A-Z0-9_-]*$/, "SUPERADMIN_BILLING.VALIDATION.USE_UPPERCASE_LETTERS_NUMBERS_UNDERSCORES_OR_HYPHENS")),
  discount: z.string({ error: "SUPERADMIN_BILLING.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_BILLING.VALIDATION.ENTER_A_DISCOUNT_SUCH_AS_20_OR_999_FLAT").max(32, "SUPERADMIN_BILLING.VALIDATION.DISCOUNT_VALUE_IS_TOO_LONG").refine((value) => {
    const percentage = /^(\d+(?:\.\d{1,2})?)%$/.exec(value);
    if (percentage) { const amount = Number(percentage[1]); return Number.isFinite(amount) && amount > 0 && amount <= 100; }
    const flat = /^(\d+(?:\.\d{1,2})?)\s+flat$/i.exec(value);
    if (flat) { const amount = Number(flat[1]); return Number.isFinite(amount) && amount > 0; }
    return false;
  }, "SUPERADMIN_BILLING.VALIDATION.ENTER_A_DISCOUNT_SUCH_AS_20_OR_999_FLAT"),
  expiry: SuperadminBillingPromoExpirySchema,
  maxUses: z.number({ error: "SUPERADMIN_BILLING.VALIDATION.ENTER_A_VALID_NUMBER" }).int("SUPERADMIN_BILLING.VALIDATION.MAXIMUM_USES_MUST_BE_A_WHOLE_NUMBER").positive("SUPERADMIN_BILLING.VALIDATION.MAXIMUM_USES_MUST_BE_GREATER_THAN_ZERO"),
}, { error: "SUPERADMIN_BILLING.VALIDATION.PROVIDE_VALID_FORM_DATA" });

/**
 * Defines the public SuperadminBillingPromoFormValues contract for plans promotions. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminBillingPromoFormValues = z.infer<typeof SuperadminBillingPromoSchema>;
