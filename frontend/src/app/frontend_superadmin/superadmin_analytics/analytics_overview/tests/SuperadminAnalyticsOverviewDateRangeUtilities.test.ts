// RESPONSIBILITY: Define source-level test coverage for analytics overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_analytics/analytics_overview/tests/SuperadminAnalyticsOverviewDateRangeUtilities.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { getSuperadminReportsVisiblePointCount } from '@/app/frontend_superadmin/superadmin_analytics/analytics_overview/utils/SuperadminAnalyticsOverviewDateRangeUtilities';

describe('getSuperadminReportsVisiblePointCount', () => {
  it('limits the 30-day preview to one available point', () => expect(getSuperadminReportsVisiblePointCount('Last 30 Days', 8)).toBe(1));
  it('limits year-to-date preview to four points or fewer when the fixture is short', () => {
    expect(getSuperadminReportsVisiblePointCount('This Year', 8)).toBe(4);
    expect(getSuperadminReportsVisiblePointCount('This Year', 2)).toBe(2);
  });
  it('handles empty or invalid data counts safely', () => {
    expect(getSuperadminReportsVisiblePointCount('All Time', 0)).toBe(0);
    expect(getSuperadminReportsVisiblePointCount('All Time', Number.NaN)).toBe(0);
  });
});
