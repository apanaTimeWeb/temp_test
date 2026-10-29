import { describe, expect, it } from 'vitest';
import { managerFinanceRefundApiSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';
import { mapManagerRefundsRefund } from '@/app/frontend_manager/manager_finance/finance_refunds/utils/ManagerFinanceRefundsApiMapping';
describe('manager_refunds API mapping', () => {
  it('maps explicit refund fields and keeps unknown status explicit', () => {
    const row = managerFinanceRefundApiSchema.parse({ id: 12, name: 'Test', amount: 100, status: 'unexpected', date: '2026-10-14' });
    expect(mapManagerRefundsRefund(row)).toMatchObject({ id: '12', amount: 100, status: 'unknown' });
  });
});
