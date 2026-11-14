// FLOW: Feature source -> superadmin_billing/billing_member_refunds/types/SuperadminBillingOverviewMemberRefundsPaymentTypes.ts -> shared local type contract -> component/API/hook consumers.
/** Responsibility: Member Refunds types; owns only the refund resource contract. */
export interface SuperadminMemberRefund {
  id: string | number;
  studentName: string;
  smartId?: string;
  exitDate?: string;
  depositHeldMinor?: number;
  currencyCode: string;
  deductionAmountMinor?: number;
  netRefundMinor: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedDate: string;
  processedDate?: string;
  paymentMethod?: string;
  rejectionReason?: string;
}
