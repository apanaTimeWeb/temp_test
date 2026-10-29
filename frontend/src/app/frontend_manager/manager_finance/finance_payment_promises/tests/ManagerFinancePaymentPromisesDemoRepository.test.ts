import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_SAMPLE_RECEIPTS } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesDemoRepository';
import { MANAGER_FINANCE_SAMPLE_RECEIPTS as FIXTURE_SOURCE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesComponentSampleFixtures';

describe('ManagerFinancePaymentPromisesDemoRepository', () => {
  it('returns a defensive sample snapshot rather than aliasing fixture objects', () => {
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS).not.toBe(FIXTURE_SOURCE);
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS[0]).not.toBe(FIXTURE_SOURCE[0]);
    expect(MANAGER_FINANCE_SAMPLE_RECEIPTS[0]).toEqual(FIXTURE_SOURCE[0]);
  });
});
