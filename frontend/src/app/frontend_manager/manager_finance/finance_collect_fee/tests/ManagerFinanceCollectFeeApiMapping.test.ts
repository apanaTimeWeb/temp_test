import { describe, expect, it } from 'vitest';
import { managerFinancePaymentApiSchema } from '@/app/frontend_manager/manager_finance/finance_collect_fee/schemas/ManagerFinanceCollectFeeSchema';
import { mapManagerCollectFeePayment } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeApiMapping';

describe('Manager Finance payment mapping preserves missing contract data', () => {
  it('does not synthesize receipt IDs, cash mode, late-fee zero, or INR currency', () => {
    const apiRecord = managerFinancePaymentApiSchema.parse({ id: 'pay-123', date: '2026-10-14', studentName: 'Example', amount: 5000, status: 'valid' });
    const payment = mapManagerCollectFeePayment(apiRecord);
    expect(payment.id).toBe('pay-123');
    expect(payment.receiptNumber).toBeUndefined();
    expect(payment.mode).toBe('unknown');
    expect(payment.lateFee).toBeUndefined();
    expect(payment.currency).toBeUndefined();
  });
});
