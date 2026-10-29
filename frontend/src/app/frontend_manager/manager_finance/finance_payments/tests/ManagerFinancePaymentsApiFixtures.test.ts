import { describe, expect, it } from 'vitest';
import { managerFinancePaymentResponseSchema } from '@/app/frontend_manager/manager_finance/finance_payments/schemas/ManagerFinancePaymentsSchema';
import { MANAGER_FINANCE_API_PAYMENT_FIXTURES, MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE } from '@/app/frontend_manager/manager_finance/finance_payments/mocks/manager_finance_payments_fixtures/ManagerFinancePaymentsApiFixtures';
describe('manager_payments fixture ownership', () => {
  it('validates populated and empty payment fixtures', () => {
    expect(managerFinancePaymentResponseSchema.parse(MANAGER_FINANCE_API_PAYMENT_FIXTURES)).toHaveLength(4);
    expect(managerFinancePaymentResponseSchema.parse(MANAGER_FINANCE_EMPTY_PAYMENT_FIXTURE)).toEqual([]);
  });
});
