// RESPONSIBILITY: Define source-level test coverage for billing overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_billing/billing_overview/tests/SuperadminBillingOverviewFormatters.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { FormatCurrency, formatSuperadminBillingMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_overview/utils/SuperadminBillingOverviewFormatters';

describe('formatSuperadminBillingMajorPreviewCurrency', () => {
  it('formats finite numeric and numeric-string amounts as INR', () => {
    expect(formatSuperadminBillingMajorPreviewCurrency(1000, 'INR', 'en-IN')).toContain('1,000');
    expect(formatSuperadminBillingMajorPreviewCurrency('250', 'INR', 'en-IN')).toContain('250');
  });
  it('returns a safe placeholder for invalid values', () => {
    expect(formatSuperadminBillingMajorPreviewCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
    expect(formatSuperadminBillingMajorPreviewCurrency('not-a-number', 'INR', 'en-IN')).toBe('—');
    expect(formatSuperadminBillingMajorPreviewCurrency(null, 'INR', 'en-IN')).toBe('—');
  });
  it('uses the four-decimal subunit scale for CLF', () => { expect(FormatCurrency(12345, 'CLF', 'en-US')).toContain('1.2345'); });
});
