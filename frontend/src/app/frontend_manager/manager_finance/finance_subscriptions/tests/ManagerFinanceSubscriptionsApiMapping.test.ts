import { describe, expect, it } from 'vitest';
import { managerFinancePaymentApiSchema, managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_subscriptions/schemas/ManagerFinanceSubscriptionsSchema';
import { mapManagerSubscriptionsPayment, mapManagerSubscriptionsRefund } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsApiMapping';

describe('Manager Finance API mapping preserves missing contract data', () => {
  it('does not synthesize receipt IDs, cash mode, late-fee zero, or INR currency', () => {
    const apiRecord = managerFinancePaymentApiSchema.parse({ id: 'pay-123', date: '2026-10-14', studentName: 'Example', amount: 5000, status: 'valid' });
    const payment = mapManagerSubscriptionsPayment(apiRecord);

    expect(payment.id).toBe('pay-123');
    expect(payment.receiptNumber).toBeUndefined();
    expect(payment.mode).toBe('unknown');
    expect(payment.lateFee).toBeUndefined();
    expect(payment.currency).toBeUndefined();
  });

  it('does not infer refund amount/date meanings from generic amount/date fields', () => {
    const apiRecord = managerFinanceRefundApiSchema.parse({ id: 'refund-123', name: 'Example', amount: 9000, status: 'pending', date: '2026-10-14' });
    const refund = mapManagerSubscriptionsRefund(apiRecord);

    expect(refund.netRefund).toBeUndefined();
    expect(refund.depositHeld).toBeUndefined();
    expect(refund.deductionAmount).toBeUndefined();
    expect(refund.exitDate).toBeUndefined();
    expect(refund.requestedDate).toBeUndefined();
    expect(refund.currency).toBeUndefined();
  });
});
