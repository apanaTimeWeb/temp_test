// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewFormatters.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminReportsMajorPreviewCurrency } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/utils/SuperadminAnalyticsOverviewFormatters';

describe('formatSuperadminReportsMajorPreviewCurrency', () => {
  it('formats finite amounts as INR using the requested locale', () => {
    expect(formatSuperadminReportsMajorPreviewCurrency(1000, 'en-IN', 'INR')).toContain('1,000');
    expect(formatSuperadminReportsMajorPreviewCurrency(1000, 'en-US', 'INR')).toContain('1,000');
  });

  it('returns a safe placeholder for non-finite values', () => {
    expect(formatSuperadminReportsMajorPreviewCurrency(Number.NaN, 'en-IN', 'INR')).toBe('—');
    expect(formatSuperadminReportsMajorPreviewCurrency(Number.POSITIVE_INFINITY, 'en-IN', 'INR')).toBe('—');
  });
});
