import { describe, expect, it } from 'vitest';
import { managerFinancePaymentApiSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';
import { mapManagerPaymentsPayment } from '@/app/frontend_manager/manager_finance/finance_payments/utils/ManagerFinancePaymentsApiMapping';
describe('manager_payments API mapping', () => {
  it('maps only the explicit payment fields and keeps unknown status explicit', () => {
    const row = managerFinancePaymentApiSchema.parse({ id: 123, date: '2026-10-14', studentName: 'Test', amount: 100, status: 'unexpected' });
    expect(mapManagerPaymentsPayment(row)).toMatchObject({ id: '123', studentName: 'Test', amount: 100, status: 'unknown' });
  });
});
