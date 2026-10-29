import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_manager/manager_finance/finance_fines_payments/hooks/ManagerFinanceFinesPaymentsDemoRepository';
import { MANAGER_FINANCE_SAMPLE_RECEIPTS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_finance/finance_fines_payments/mocks/manager_finance_fines_payments_fixtures/ManagerFinanceFinesPaymentsComponentSampleFixtures';

describe('ManagerFinanceFinesPaymentsDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
