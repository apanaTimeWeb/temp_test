// FLOW: Feature form/API boundary -> superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas.ts -> parsed/validated input -> typed feature action.
/** Responsibility: Superadmin Finance Read Schema; defines runtime validation for the named module contract. */
import { z } from 'zod';

const SuperadminMemberPaymentIdentifierSchema = z.union([z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }), z.number({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_NUMBER" })]);
const SuperadminMemberPaymentOptionalString = z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).optional().nullable();
const SuperadminMemberPaymentMinorUnits = z.number({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_NUMBER" }).int().safe().nonnegative();
const SuperadminMemberPaymentOptionalMinorUnits = SuperadminMemberPaymentMinorUnits.nullable().optional();
const SuperadminMemberPaymentCurrencyCode = z.string({ error: "SUPERADMIN_FINANCE.VALIDATION.ENTER_A_VALID_TEXT_VALUE" }).regex(/^[A-Z]{3}$/);
export const SuperadminMemberPaymentResponseSchema = z.object({
  id: SuperadminMemberPaymentIdentifierSchema,
  receiptNumber: SuperadminMemberPaymentOptionalString,
  date: SuperadminMemberPaymentOptionalString,
  studentName: SuperadminMemberPaymentOptionalString,
  smartId: SuperadminMemberPaymentOptionalString,
  amountMinor: SuperadminMemberPaymentMinorUnits,
  currencyCode: SuperadminMemberPaymentCurrencyCode,
  mode: SuperadminMemberPaymentOptionalString,
  txnId: SuperadminMemberPaymentOptionalString,
  lateFeeMinor: SuperadminMemberPaymentOptionalMinorUnits,
  receivedBy: SuperadminMemberPaymentOptionalString,
  remark: SuperadminMemberPaymentOptionalString,
  status: SuperadminMemberPaymentOptionalString,
  deletionReason: SuperadminMemberPaymentOptionalString,
}, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_VALID_FORM_DATA" }).passthrough();
export const SuperadminBillingOverviewMemberPaymentsResponseSchema = z.array(SuperadminMemberPaymentResponseSchema, { error: "SUPERADMIN_FINANCE.VALIDATION.PROVIDE_A_VALID_LIST" });
