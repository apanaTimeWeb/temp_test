import type { z } from 'zod';
import { managerFinancePaymentApiSchema } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeSchema';
import type { ManagerFinanceCollectFeePayment } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeTypes';
import { normalizeManagerCollectFeePaymentStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeStatusNormalization';

type PaymentApiRecord = z.infer<typeof managerFinancePaymentApiSchema>;

/** Maps only explicit fields. No receipt number, default payment mode, or currency is synthesized. */
export function mapManagerCollectFeePayment(payment: PaymentApiRecord): ManagerFinanceCollectFeePayment {
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
    status: normalizeManagerCollectFeePaymentStatus(payment.status),
    currency: payment.currency,
  };
}
