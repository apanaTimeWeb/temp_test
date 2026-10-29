import { describe, expect, it } from 'vitest';
import { normalizeManagerRenewalsPaymentStatus, normalizeManagerRenewalsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_renewals/utils/ManagerFinanceRenewalsStatusNormalization';

describe('ManagerFinanceRenewalsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerRenewalsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerRenewalsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerRenewalsPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerRenewalsPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerRenewalsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerRenewalsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerRenewalsRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerRenewalsRefundStatus('processing')).toBe('unknown');
  });
});
