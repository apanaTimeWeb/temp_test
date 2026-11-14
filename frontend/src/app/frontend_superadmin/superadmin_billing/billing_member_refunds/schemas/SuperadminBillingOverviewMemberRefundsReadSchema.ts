// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_refunds/schemas/SuperadminBillingOverviewMemberRefundsReadSchema.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Finance Read Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminMemberRefundIdentifierSchema = z.union([z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }), z.number({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_NUMBER" })]);
const SuperadminMemberRefundOptionalString = z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional().nullable();
const SuperadminMemberRefundMinorUnits = z.number({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_NUMBER" }).int().safe().nonnegative();
const SuperadminMemberRefundOptionalMinorUnits = SuperadminMemberRefundMinorUnits.nullable().optional();
const SuperadminMemberRefundCurrencyCode = z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^[A-Z]{3}$/);
export const SuperadminMemberRefundResponseSchema = z.object({
  id: SuperadminMemberRefundIdentifierSchema,
  name: SuperadminMemberRefundOptionalString,
  smartId: SuperadminMemberRefundOptionalString,
  date: SuperadminMemberRefundOptionalString,
  requestedDate: SuperadminMemberRefundOptionalString,
  exitDate: SuperadminMemberRefundOptionalString,
  processedDate: SuperadminMemberRefundOptionalString,
  paymentMethod: SuperadminMemberRefundOptionalString,
  rejectionReason: SuperadminMemberRefundOptionalString,
  depositHeldMinor: SuperadminMemberRefundOptionalMinorUnits,
  deductionAmountMinor: SuperadminMemberRefundOptionalMinorUnits,
  netRefundMinor: SuperadminMemberRefundMinorUnits,
  currencyCode: SuperadminMemberRefundCurrencyCode,
  status: z.enum(['pending', 'approved', 'rejected', 'processed'], { error: "SUPERADMIN_FINANCE.VALIDATION.SELECT_A_VALID_OPTION" }),
}, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_VALID_FORM_DATA" }).passthrough();
export const SuperadminBillingOverviewMemberRefundsResponseSchema = z.array(SuperadminMemberRefundResponseSchema, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_A_VALID_LIST" });
