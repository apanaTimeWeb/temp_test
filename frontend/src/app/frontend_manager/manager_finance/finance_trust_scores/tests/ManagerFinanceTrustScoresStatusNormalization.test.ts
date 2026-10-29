import { describe, expect, it } from 'vitest';
import { normalizeManagerTrustScoresPaymentStatus, normalizeManagerTrustScoresRefundStatus } from '@/app/frontend_manager/manager_finance/finance_trust_scores/utils/ManagerFinanceTrustScoresStatusNormalization';

describe('ManagerFinanceTrustScoresStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerTrustScoresPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerTrustScoresPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerTrustScoresPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerTrustScoresPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerTrustScoresRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerTrustScoresRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerTrustScoresRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerTrustScoresRefundStatus('processing')).toBe('unknown');
  });
});
