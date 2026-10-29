import { describe, expect, it } from 'vitest';
import { normalizeManagerInvoicePaymentStatus, normalizeManagerInvoiceRefundStatus } from '@/app/frontend_manager/manager_finance/finance_invoices/utils/ManagerFinanceInvoicesStatusNormalization';

describe('ManagerFinanceInvoicesStatusNormalization', () => {
  it('preserves known payment states and does not treat unknown states as valid', () => {
    expect(normalizeManagerInvoicePaymentStatus('valid')).toBe('valid');
    expect(normalizeManagerInvoicePaymentStatus('deleted')).toBe('deleted');
    expect(normalizeManagerInvoicePaymentStatus('reversed')).toBe('unknown');
    expect(normalizeManagerInvoicePaymentStatus('')).toBe('unknown');
  });

  it('preserves known refund states and does not treat unknown states as pending', () => {
    expect(normalizeManagerInvoiceRefundStatus('pending')).toBe('pending');
    expect(normalizeManagerInvoiceRefundStatus('processed')).toBe('processed');
    expect(normalizeManagerInvoiceRefundStatus('cancelled')).toBe('unknown');
    expect(normalizeManagerInvoiceRefundStatus('processing')).toBe('unknown');
  });
});
