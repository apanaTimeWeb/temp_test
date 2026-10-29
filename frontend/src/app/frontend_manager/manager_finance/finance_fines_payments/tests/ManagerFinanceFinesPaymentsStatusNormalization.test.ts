import { describe, expect, it } from 'vitest';
import { normalizeManagerFinesPaymentsPaymentStatus, normalizeManagerFinesPaymentsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_fines_payments/utils/ManagerFinanceFinesPaymentsStatusNormalization';

describe('ManagerFinanceFinesPaymentsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerFinesPaymentsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerFinesPaymentsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerFinesPaymentsPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerFinesPaymentsPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerFinesPaymentsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerFinesPaymentsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerFinesPaymentsRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerFinesPaymentsRefundStatus('processing')).toBe('unknown');
  });
});
