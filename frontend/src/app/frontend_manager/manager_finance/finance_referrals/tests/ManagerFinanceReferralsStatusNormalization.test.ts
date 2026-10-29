import { describe, expect, it } from 'vitest';
import { normalizeManagerReferralsPaymentStatus, normalizeManagerReferralsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_referrals/utils/ManagerFinanceReferralsStatusNormalization';

describe('ManagerFinanceReferralsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerReferralsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerReferralsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerReferralsPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerReferralsPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerReferralsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerReferralsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerReferralsRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerReferralsRefundStatus('processing')).toBe('unknown');
  });
});
