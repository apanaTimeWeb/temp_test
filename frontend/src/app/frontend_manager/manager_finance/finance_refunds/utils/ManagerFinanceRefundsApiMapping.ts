import type { z } from 'zod';
import { managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';
import type { ManagerFinanceRefundsRefund } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsTypes';
import { normalizeManagerRefundsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_refunds/utils/ManagerFinanceRefundsStatusNormalization';
type RefundApiRecord = z.infer<typeof managerFinanceRefundApiSchema>;
export function mapManagerRefundsRefund(refund: RefundApiRecord): ManagerFinanceRefundsRefund {
  return { id: String(refund.id), studentName: refund.name, smartId: refund.smartId ?? '—', amount: refund.amount, exitDate: refund.exitDate, depositHeld: refund.depositHeld, deductionAmount: refund.deductionAmount, status: normalizeManagerRefundsRefundStatus(refund.status), requestedDate: refund.requestedDate, processedDate: refund.processedDate, paymentMethod: refund.paymentMethod, rejectionReason: refund.rejectionReason, currency: refund.currency };
}
