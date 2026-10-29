import { describe, expect, it } from 'vitest';
import { normalizeManagerPaymentsPaymentStatus } from '@/app/frontend_manager/manager_finance/finance_payments/utils/ManagerFinancePaymentsStatusNormalization';
describe('manager_payments status normalization', () => {
  it('preserves known statuses and fails unknown values closed', () => {
    expect(normalizeManagerPaymentsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerPaymentsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerPaymentsPaymentStatus('processing')).toBe('unknown');
  });
});
