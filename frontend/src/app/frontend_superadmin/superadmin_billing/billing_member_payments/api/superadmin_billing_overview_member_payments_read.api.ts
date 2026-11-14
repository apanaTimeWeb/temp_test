// FLOW: Feature caller -> superadmin_billing/billing_member_payments/api/superadmin_billing_overview_member_payments_read.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Responsibility: Member Payments read API boundary; owns only payment records. */
import { apiFetch } from '@/lib/api';
import { parseSuperadminBillingMemberPaymentsApiResponse } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/utils/SuperadminBillingMemberPaymentsApiResponse';
import { SUPERADMIN_BILLING_MEMBER_PAYMENTS_API as __SUPERADMIN_BILLING_MEMBER_PAYMENTS_API } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/config/superadmin_billing_member_payments.url_config';
import { SuperadminBillingOverviewMemberPaymentsResponseSchema } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/schemas/superadmin_billing_member_payments.schemas';
import type { SuperadminMemberPayment } from '@/app/frontend_superadmin/superadmin_billing/billing_member_payments/types/superadmin_billing_member_payments.types';

function SuperadminBillingOverviewMemberPaymentsDateOnly(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
}

/** Fetches and validates payment records using the existing observed list endpoint. */
export async function fetchSuperadminBillingOverviewMemberPayments(): Promise<SuperadminMemberPayment[]> {
  const payload: unknown = await apiFetch(__SUPERADMIN_BILLING_MEMBER_PAYMENTS_API.PAYMENTS_LIST);
  return parseSuperadminBillingMemberPaymentsApiResponse(payload, (data) => SuperadminBillingOverviewMemberPaymentsResponseSchema.parse(data)).map((payment) => {
    const rawStatus = payment.status ?? 'unknown';
    return {
      id: payment.id,
      receiptNumber: payment.receiptNumber ?? '',
      date: SuperadminBillingOverviewMemberPaymentsDateOnly(payment.date),
      studentName: payment.studentName ?? '—',
      smartId: payment.smartId ?? '',
      amountMinor: payment.amountMinor,
      currencyCode: payment.currencyCode,
      mode: payment.mode ?? '—',
      lateFeeMinor: payment.lateFeeMinor ?? 0,
      receivedBy: payment.receivedBy ?? '—',
      remark: payment.remark ?? undefined,
      status: rawStatus === 'completed' ? 'valid' : rawStatus === 'voided' ? 'deleted' : rawStatus,
      txnId: payment.txnId ?? undefined,
      deletionReason: payment.deletionReason ?? undefined,
    };
  });
}
