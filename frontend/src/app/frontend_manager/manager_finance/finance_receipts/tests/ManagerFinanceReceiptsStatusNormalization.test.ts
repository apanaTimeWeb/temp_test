import { describe, expect, it } from 'vitest';
import { normalizeManagerReceiptPaymentStatus, normalizeManagerReceiptRefundStatus } from '@/app/frontend_manager/manager_finance/finance_receipts/utils/ManagerFinanceReceiptsStatusNormalization';

describe('ManagerFinanceReceiptsStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerReceiptPaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerReceiptPaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerReceiptPaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerReceiptPaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerReceiptRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerReceiptRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerReceiptRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerReceiptRefundStatus('processing')).toBe('unknown');
  });
});
