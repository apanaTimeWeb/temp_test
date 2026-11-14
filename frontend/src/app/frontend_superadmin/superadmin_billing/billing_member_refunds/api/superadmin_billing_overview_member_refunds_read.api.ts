// FLOW: Feature caller -> superadmin_billing/billing_member_refunds/api/superadmin_billing_overview_member_refunds_read.api.ts -> canonical URL contract and host transport boundary -> typed result/error handling; live transport is supplied by the host.
/** Responsibility: Member Refunds read API boundary; owns only refund records. */
import { apiFetch } from '@/lib/api';
import { parseSuperadminBillingMemberRefundsApiResponse } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/utils/SuperadminBillingMemberRefundsApiResponse';
import { SUPERADMIN_BILLING_MEMBER_REFUNDS_API as __SUPERADMIN_BILLING_MEMBER_REFUNDS_API } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/config/billing_member_refunds.url_config';
import { SuperadminBillingOverviewMemberRefundsResponseSchema } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/schemas/SuperadminBillingOverviewMemberRefundsReadSchema';
import type { SuperadminMemberRefund } from '@/app/frontend_superadmin/superadmin_billing/billing_member_refunds/types/SuperadminBillingOverviewMemberRefundsPaymentTypes';

function SuperadminBillingOverviewMemberRefundsDateOnly(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString().slice(0, 10) : '';
}

/** Fetches and validates refund records using the existing observed list endpoint. */
export async function fetchSuperadminBillingOverviewMemberRefunds(): Promise<SuperadminMemberRefund[]> {
  const payload: unknown = await apiFetch(__SUPERADMIN_BILLING_MEMBER_REFUNDS_API.REFUNDS_LIST);
  return parseSuperadminBillingMemberRefundsApiResponse(payload, (data) => SuperadminBillingOverviewMemberRefundsResponseSchema.parse(data)).map((refund) => ({
    id: refund.id,
    studentName: refund.name ?? '—',
    smartId: refund.smartId ?? undefined,
    exitDate: refund.exitDate ? SuperadminBillingOverviewMemberRefundsDateOnly(refund.exitDate) : undefined,
    depositHeldMinor: refund.depositHeldMinor ?? undefined,
    currencyCode: refund.currencyCode,
    deductionAmountMinor: refund.deductionAmountMinor ?? undefined,
    netRefundMinor: refund.netRefundMinor,
    status: refund.status,
    requestedDate: SuperadminBillingOverviewMemberRefundsDateOnly(refund.requestedDate ?? refund.date),
    processedDate: refund.processedDate ? SuperadminBillingOverviewMemberRefundsDateOnly(refund.processedDate) : undefined,
    paymentMethod: refund.paymentMethod ?? undefined,
    rejectionReason: refund.rejectionReason ?? undefined,
  }));
}
