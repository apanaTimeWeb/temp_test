import { describe, expect, it } from 'vitest';
import { managerFinanceRefundResponseSchema } from '@/app/frontend_manager/manager_finance/finance_refunds/schemas/ManagerFinanceRefundsSchema';
import { MANAGER_FINANCE_API_REFUND_FIXTURES, MANAGER_FINANCE_EMPTY_REFUND_FIXTURE } from '@/app/frontend_manager/manager_finance/finance_refunds/mocks/manager_finance_refunds_fixtures/ManagerFinanceRefundsApiFixtures';
describe('manager_refunds fixture ownership', () => {
  it('validates populated and empty refund fixtures', () => {
    expect(managerFinanceRefundResponseSchema.parse(MANAGER_FINANCE_API_REFUND_FIXTURES)).toHaveLength(4);
    expect(managerFinanceRefundResponseSchema.parse(MANAGER_FINANCE_EMPTY_REFUND_FIXTURE)).toEqual([]);
  });
});
