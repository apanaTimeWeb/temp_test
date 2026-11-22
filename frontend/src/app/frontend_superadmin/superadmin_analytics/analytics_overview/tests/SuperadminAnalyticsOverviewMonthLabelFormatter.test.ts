// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewMonthLabelFormatter.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminAnalyticsOverviewMonthLabel } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/utils/SuperadminAnalyticsOverviewMonthLabelFormatter';

describe('formatSuperadminAnalyticsOverviewMonthLabel', () => {
  it('maps all canonical month labels without timezone rollover', () => {
    const canonicalMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (const month of canonicalMonths) {
      expect(formatSuperadminAnalyticsOverviewMonthLabel(month, 'en-US')).toBe(month);
    }
  });

  it('preserves unknown fixture labels', () => {
    expect(formatSuperadminAnalyticsOverviewMonthLabel('Quarter 1', 'en-US')).toBe('Quarter 1');
  });

  it('supports the supplied Hindi locale', () => {
    expect(formatSuperadminAnalyticsOverviewMonthLabel('Jan', 'hi')).not.toBe('');
  });
});
