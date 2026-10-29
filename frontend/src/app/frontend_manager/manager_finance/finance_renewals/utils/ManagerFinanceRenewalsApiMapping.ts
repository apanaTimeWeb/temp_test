import type { z } from 'zod';
import { managerFinancePaymentApiSchema, managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_renewals/schemas/ManagerFinanceRenewalsSchema';
import type { ManagerFinanceRenewalsPayment, ManagerFinanceRenewalsRefund } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsTypes';
import { normalizeManagerRenewalsPaymentStatus, normalizeManagerRenewalsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsStatusNormalization';

type PaymentApiRecord = z.infer<typeof managerFinancePaymentApiSchema>;
type RefundApiRecord = z.infer<typeof managerFinanceRefundApiSchema>;

/** Maps only explicitly supplied contract fields; no payment or receipt identity is synthesized. */
export function mapManagerRenewalsPayment(payment: PaymentApiRecord): ManagerFinanceRenewalsPayment {
  const mode = payment.mode === 'cash' || payment.mode === 'upi' || payment.mode === 'card' || payment.mode === 'bank'
    ? payment.mode
    : 'unknown';

  return {
    id: String(payment.id),
    date: payment.date,
    studentName: payment.studentName,
    smartId: payment.smartId ?? '—',
    amount: payment.amount,
    mode,
    txnId: payment.txnId,
    lateFee: payment.lateFee,
    receivedBy: payment.receivedBy ?? '—',
    remark: payment.remark,
    status: normalizeManagerRenewalsPaymentStatus(payment.status),
    currency: payment.currency,
  };
}

/** Generic refund amount/date fields are not assumed to mean net refund, exit date, or request date. */
export function mapManagerRenewalsRefund(refund: RefundApiRecord): ManagerFinanceRenewalsRefund {
  return {
    id: String(refund.id),
    studentName: refund.name,
    smartId: refund.smartId ?? '—',
    exitDate: refund.exitDate,
    depositHeld: refund.depositHeld,
    deductionAmount: refund.deductionAmount,
    status: normalizeManagerRenewalsRefundStatus(refund.status),
    requestedDate: refund.requestedDate,
    processedDate: refund.processedDate,
    paymentMethod: refund.paymentMethod,
    rejectionReason: refund.rejectionReason,
    currency: refund.currency,
  };
}
