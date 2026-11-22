// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewFormatCurrency.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { FormatCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewFormatters';

describe('module-local minor-unit currency contract', () => {
  it('formats explicit ISO currency using the supplied locale', () => {
    expect(FormatCurrency(123456, 'INR', 'en-IN')).toContain('1,234.56');
    expect(FormatCurrency(123456, 'USD', 'en-US')).toContain('1,234.56');
  });
  it('uses currency-specific subunit divisors', () => {
    expect(FormatCurrency(1234, 'JPY', 'ja-JP')).toContain('1,234');
    expect(FormatCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
  });
  it('rejects non-integer/non-finite minor units and invalid currency codes', () => {
    expect(FormatCurrency(1.5, 'INR', 'en-IN')).toBe('—');
    expect(FormatCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
    expect(FormatCurrency(Number.MAX_SAFE_INTEGER + 1, 'INR', 'en-IN')).toBe('—');
    expect(FormatCurrency(100, 'rupees', 'en-IN')).toBe('—');
  });
});
