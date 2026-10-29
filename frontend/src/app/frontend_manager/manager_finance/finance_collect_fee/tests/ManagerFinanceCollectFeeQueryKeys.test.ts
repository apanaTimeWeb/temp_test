import { describe, expect, it } from 'vitest';
import { MANAGER_FINANCE_QUERY_KEYS } from '@/app/frontend_manager/manager_finance/finance_collect_fee/api/manager_finance_collect_fee.query_keys';

describe('ManagerFinanceCollectFeeQueryKeys', () => {
  it('uses the canonical Collect Fee namespace for its payment resource only', () => {
    expect(MANAGER_FINANCE_QUERY_KEYS.payments()).toEqual(['manager_collect_fee', 'payments']);
    expect(Object.keys(MANAGER_FINANCE_QUERY_KEYS)).toEqual(['payments']);
  });
});
