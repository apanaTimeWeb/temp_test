import { describe, expect, it } from 'vitest';
import { normalizeManagerAutoSuspendPaymentStatus, normalizeManagerAutoSuspendRefundStatus } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/utils/ManagerFinanceAutoSuspendStatusNormalization';

describe('ManagerFinanceAutoSuspendStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerAutoSuspendPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerAutoSuspendPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerAutoSuspendPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerAutoSuspendPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerAutoSuspendRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerAutoSuspendRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerAutoSuspendRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerAutoSuspendRefundStatus('processing')).toBe('unknown');
  });
});
