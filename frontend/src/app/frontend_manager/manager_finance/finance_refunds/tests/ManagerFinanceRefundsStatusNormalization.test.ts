import { describe, expect, it } from 'vitest';
import { normalizeManagerRefundsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_refunds/utils/ManagerFinanceRefundsStatusNormalization';
describe('manager_refunds status normalization', () => {
  it('preserves known statuses and fails unknown values closed', () => {
    expect(normalizeManagerRefundsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerRefundsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerRefundsRefundStatus('processing')).toBe('unknown');
  });
});
