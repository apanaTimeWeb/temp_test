// RESPONSIBILITY: Define source-level test coverage for billing invoices using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_invoices/tests/SuperadminBillingInvoicesCurrencySubunitContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesFormatters';

describe('FormatCurrency currency subunit contract', () => {
  it('formats a supported zero-decimal currency without a two-decimal fallback', () => {
    expect(FormatCurrency(1234, 'JPY', 'en-US')).not.toBe('—');
  });

  it('does not guess a divisor for an unsupported currency code', () => {
    expect(FormatCurrency(1234, 'ZZZ', 'en-US')).toBe('—');
  });
});
