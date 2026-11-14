// RESPONSIBILITY: Define validation schemas for billing member payments collection; schema validity does not replace server-side validation.
// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_payments_collection/schemas/SuperadminBillingOverviewMemberPaymentsCollectionSchema.ts -> parsed/validated input -> typed feature action.
import { z } from 'zod';
import { SUPERADMIN_FINANCE_PAYMENT_MODES } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';

/** Validation for the local-only receipt-preview form. This does not authorize or process a payment. */
export const SUPERADMIN_FINANCE_COLLECT_FEE_SCHEMA = z.object({
  amount: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_FINANCE.VALIDATION.ENTER_AN_AMOUNT_GREATER_THAN_ZERO").refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, "SUPERADMIN_FINANCE.VALIDATION.AMOUNT_MUST_BE_A_FINITE_NUMBER_GREATER_THAN_ZERO"),
  mode: z.enum(SUPERADMIN_FINANCE_PAYMENT_MODES, { error: "SUPERADMIN_FINANCE.VALIDATION.SELECT_A_VALID_OPTION" }),
  transactionId: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(120, "SUPERADMIN_FINANCE.VALIDATION.TRANSACTION_REFERENCE_MUST_BE_120_CHARACTERS_OR_FEWER"),
  couponCode: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(80, "SUPERADMIN_FINANCE.VALIDATION.COUPON_CODE_MUST_BE_80_CHARACTERS_OR_FEWER"),
  lateFee: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(1, "SUPERADMIN_FINANCE.VALIDATION.ENTER_ZERO_OR_A_POSITIVE_LATE_FEE").refine((value) => Number.isFinite(Number(value)) && Number(value) >= 0, "SUPERADMIN_FINANCE.VALIDATION.LATE_FEE_MUST_BE_A_FINITE_NON_NEGATIVE_NUMBER"),
  remark: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(500, "SUPERADMIN_FINANCE.VALIDATION.REMARK_MUST_BE_500_CHARACTERS_OR_FEWER"),
}, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_VALID_FORM_DATA" }).superRefine((values, context) => {
  if (values.mode !== 'cash' && values.transactionId.length === 0) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['transactionId'], message: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_TRANSACTION_REFERENCE_FOR_THIS_PREVIEW_MODE" });
  }
});

/**
 * Defines the public SuperadminFinanceCollectFeeFormValues contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminFinanceCollectFeeFormValues = z.infer<typeof SUPERADMIN_FINANCE_COLLECT_FEE_SCHEMA>;
