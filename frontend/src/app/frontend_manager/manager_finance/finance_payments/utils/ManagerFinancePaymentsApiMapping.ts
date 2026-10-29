import type { z } from 'zod';
import { managerFinancePaymentApiSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';
import type { ManagerFinancePaymentsPayment } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsTypes';
import { normalizeManagerPaymentsPaymentStatus } from '@/app/frontend_manager/manager_finance/finance_payments/utils/ManagerFinancePaymentsStatusNormalization';
type PaymentApiRecord = z.infer<typeof managerFinancePaymentApiSchema>;
export function mapManagerPaymentsPayment(payment: PaymentApiRecord): ManagerFinancePaymentsPayment {
  const mode = payment.mode === 'cash' || payment.mode === 'upi' || payment.mode === 'card' || payment.mode === 'bank' ? payment.mode : 'unknown';
  return { id: String(payment.id), date: payment.date, studentName: payment.studentName, smartId: payment.smartId ?? '—', amount: payment.amount, mode, txnId: payment.txnId, lateFee: payment.lateFee, receivedBy: payment.receivedBy ?? '—', remark: payment.remark, status: normalizeManagerPaymentsPaymentStatus(payment.status), currency: payment.currency };
}
