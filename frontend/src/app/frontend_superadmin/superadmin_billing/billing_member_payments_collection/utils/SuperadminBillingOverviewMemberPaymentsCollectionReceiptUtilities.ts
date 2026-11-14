// RESPONSIBILITY: Format or generate the declared local sample/export output for billing member payments collection; it does not represent a live backend export or record.
// FLOW: Feature caller -> superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionReceiptUtilities.ts -> typed local sample input -> generated preview/export output.
import { SUPERADMIN_FINANCE_MODE_LABELS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/utils/SuperadminBillingOverviewMemberPaymentsCollectionFormatters';
import type { SuperadminFinancePaymentMode } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/constants/SuperadminBillingOverviewMemberPaymentsCollectionConstants';
import type { SuperadminFinanceMockStudent } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments_collection/types/SuperadminBillingOverviewMemberPaymentsCollectionTypes';

/** Produces printable demonstration text only; it does not create a payment receipt. 
 * @param params - Input supplied by the caller under the declared TypeScript contract.
 * @returns The module-owned state/actions or utility result consumed by the caller.
 */
export function buildSuperadminFinanceSampleWhatsAppReceipt(params: {
  receiptNo: string;
  student: SuperadminFinanceMockStudent;
  amount: number;
  mode: SuperadminFinancePaymentMode;
  txnId: string;
  lateFee: number;
  couponDiscount: number;
  total: number;
  remark: string;
  date: string;
  locale: string;
}): string {
  const { receiptNo, student, amount, mode, txnId, lateFee, couponDiscount, total, remark, date, locale } = params;
  const width = 42;
  const line = '─'.repeat(width);
  const center = (value: string) => ' '.repeat(Math.max(0, Math.floor((width - value.length) / 2))) + value;
  const right = (label: string, value: string) => label + ' '.repeat(Math.max(1, width - label.length - value.length)) + value;
  const lines = [
    center('★ Library OS ★'), center('Main Branch'), line, center('[ SAMPLE RECEIPT PREVIEW ]'), line,
    right('Reference:', receiptNo), right('Date    :', date), '', right('Name    :', student.name),
    right('Smart ID:', `#${student.smartId}`), right('Phone   :', student.phone), '', line,
    right('Plan    :', student.plan), right('Shift   :', student.shift), right('Seat    :', student.seat), line,
    right('Base Amt:', formatMajorUnitPreviewCurrency(amount, 'INR', locale)),
    ...(lateFee > 0 ? [right('Late Fee:', formatMajorUnitPreviewCurrency(lateFee, 'INR', locale))] : []),
    ...(couponDiscount > 0 ? [right('Discount:', `-${formatMajorUnitPreviewCurrency(couponDiscount, 'INR', locale)}`)] : []),
    right('PREVIEW :', formatMajorUnitPreviewCurrency(total, 'INR', locale)), line,
    right('Mode    :', SUPERADMIN_FINANCE_MODE_LABELS[mode]),
    ...(txnId ? [right('Txn ID  :', txnId)] : []), '',
    ...(remark ? [`Note    : ${remark}`, ''] : []),
    center('SAMPLE PREVIEW — NOT A PAYMENT'), center('No transaction has been recorded.'), line, center('Library OS'),
  ];
  return lines.join('\n');
}
