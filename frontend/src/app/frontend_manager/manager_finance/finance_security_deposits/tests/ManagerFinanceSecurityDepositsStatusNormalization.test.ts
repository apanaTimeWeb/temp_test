import { describe, expect, it } from 'vitest';
import { normalizeManagerSecurityDepositsPaymentStatus, normalizeManagerSecurityDepositsRefundStatus } from '@/app/frontend_manager/manager_finance/finance_security_deposits/utils/ManagerFinanceSecurityDepositsStatusNormalization';

describe('ManagerFinanceSecurityDepositsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerSecurityDepositsPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerSecurityDepositsPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerSecurityDepositsPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerSecurityDepositsPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerSecurityDepositsRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerSecurityDepositsRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerSecurityDepositsRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerSecurityDepositsRefundStatus('processing')).toBe('unknown');
  });
});
