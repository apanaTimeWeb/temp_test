import { describe, expect, it } from 'vitest';
import { normalizeManagerLateFeesPaymentStatus, normalizeManagerLateFeesRefundStatus } from '@/app/frontend_manager/manager_finance/finance_late_fees/utils/ManagerFinanceLateFeesStatusNormalization';

describe('ManagerFinanceLateFeesStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerLateFeesPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerLateFeesPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerLateFeesPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerLateFeesPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerLateFeesRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerLateFeesRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerLateFeesRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerLateFeesRefundStatus('processing')).toBe('unknown');
  });
});
