import type { z } from 'zod';
import { managerFinancePaymentApiSchema, managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_subscriptions/schemas/ManagerFinanceSubscriptionsSchema';
import type { ManagerFinanceSubscriptionsPayment, ManagerFinanceSubscriptionsRefund } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsTypes';
import { normalizeManagerSubscriptionsPaymentStatus, normalizeManagerSubscriptionsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsStatusNormalization';

type PaymentApiRecord = z.infer<typeof managerFinancePaymentApiSchema>;
type RefundApiRecord = z.infer<typeof managerFinanceRefundApiSchema>;

/** Maps only explicitly supplied contract fields; no payment or receipt identity is synthesized. */
export function mapManagerSubscriptionsPayment(payment: PaymentApiRecord): ManagerFinanceSubscriptionsPayment {
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
    status: normalizeManagerSubscriptionsPaymentStatus(payment.status),
    currency: payment.currency,
  };
}

/** Generic refund amount/date fields are not assumed to mean net refund, exit date, or request date. */
export function mapManagerSubscriptionsRefund(refund: RefundApiRecord): ManagerFinanceSubscriptionsRefund {
  return {
    id: String(refund.id),
    studentName: refund.name,
    smartId: refund.smartId ?? '—',
    exitDate: refund.exitDate,
    depositHeld: refund.depositHeld,
    deductionAmount: refund.deductionAmount,
    status: normalizeManagerSubscriptionsRefundStatus(refund.status),
    requestedDate: refund.requestedDate,
    processedDate: refund.processedDate,
    paymentMethod: refund.paymentMethod,
    rejectionReason: refund.rejectionReason,
    currency: refund.currency,
  };
}
