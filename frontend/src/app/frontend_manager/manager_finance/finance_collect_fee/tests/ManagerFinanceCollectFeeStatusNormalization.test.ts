import { normalizeManagerCollectFeePaymentStatus } from '@/app/frontend_manager/manager_finance/finance_collect_fee/utils/ManagerFinanceCollectFeeStatusNormalization';
import { describe,expect,it } from 'vitest';

describe('ManagerFinanceCollectFeeStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerCollectFeePaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerCollectFeePaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerCollectFeePaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerCollectFeePaymentStatus('')).toBe('unknown');
  });
});
