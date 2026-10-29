import { describe, expect, it } from 'vitest';
import { normalizeManagerSubscriptionsPaymentStatus, normalizeManagerSubscriptionsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_subscriptions/utils/ManagerFinanceSubscriptionsStatusNormalization';

describe('ManagerFinanceSubscriptionsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerSubscriptionsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerSubscriptionsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerSubscriptionsPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerSubscriptionsPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerSubscriptionsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerSubscriptionsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerSubscriptionsRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerSubscriptionsRefundStatus('processing')).toBe('unknown');
  });
});
