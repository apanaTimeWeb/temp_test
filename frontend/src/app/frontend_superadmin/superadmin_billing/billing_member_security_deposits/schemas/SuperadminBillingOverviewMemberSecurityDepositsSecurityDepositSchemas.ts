// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_security_deposits/schemas/SuperadminBillingOverviewMemberSecurityDepositsSecurityDepositSchemas.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Finance Security Deposit Schemas; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminFinanceAmountTextSchema = z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().refine((value) => value !== '' && Number.isFinite(Number(value)) && Number(value) > 0, "SUPERADMIN_FINANCE.VALIDATION.ENTER_AN_AMOUNT_GREATER_THAN_ZERO_1E0501").refine((value) => /^\d+(?:\.\d{1,2})?$/.test(value), "SUPERADMIN_FINANCE.VALIDATION.USE_NO_MORE_THAN_TWO_DECIMAL_PLACES");

export const SuperadminFinanceSecurityDepositRefundSchema = z.object({
  refundAmount: SuperadminFinanceAmountTextSchema,
  deductionAmount: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().refine((value) => value === '' || (/^\d+(?:\.\d{1,2})?$/.test(value) && Number.isFinite(Number(value)) && Number(value) >= 0), "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_NON_NEGATIVE_AMOUNT_WITH_UP_TO_TWO_DECIMALS"),
  deductionReason: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().max(250, "SUPERADMIN_FINANCE.VALIDATION.REASON_MUST_BE_250_CHARACTERS_OR_FEWER"),
}, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_VALID_FORM_DATA" }).superRefine((values, context) => {
  if (Number(values.deductionAmount || 0) > 0 && !values.deductionReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['deductionReason'], message: "SUPERADMIN_FINANCE.VALIDATION.A_REASON_IS_REQUIRED_WHEN_A_DEDUCTION_IS_ENTERED" });
  }
});
/**
 * Defines the public SuperadminFinanceSecurityDepositRefundValues contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminFinanceSecurityDepositRefundValues = z.infer<typeof SuperadminFinanceSecurityDepositRefundSchema>;

export const SuperadminFinanceSecurityDepositDeductionSchema = z.object({
  amount: SuperadminFinanceAmountTextSchema,
  reason: z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).trim().min(3, "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_REASON_WITH_AT_LEAST_3_CHARACTERS").max(250, "SUPERADMIN_FINANCE.VALIDATION.REASON_MUST_BE_250_CHARACTERS_OR_FEWER"),
}, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_VALID_FORM_DATA" });
/**
 * Defines the public SuperadminFinanceSecurityDepositDeductionValues contract for billing overview. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminFinanceSecurityDepositDeductionValues = z.infer<typeof SuperadminFinanceSecurityDepositDeductionSchema>;
