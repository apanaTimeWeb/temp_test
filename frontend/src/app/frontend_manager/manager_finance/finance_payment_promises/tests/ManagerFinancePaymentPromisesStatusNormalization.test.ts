import { describe, expect, it } from 'vitest';
import { normalizeManagerPaymentPromisesPaymentStatus, normalizeManagerPaymentPromisesRefundStatus } from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesStatusNormalization';

describe('ManagerFinancePaymentPromisesStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerPaymentPromisesPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerPaymentPromisesPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerPaymentPromisesPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerPaymentPromisesPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerPaymentPromisesRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerPaymentPromisesRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerPaymentPromisesRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerPaymentPromisesRefundStatus('processing')).toBe('unknown');
  });
});
