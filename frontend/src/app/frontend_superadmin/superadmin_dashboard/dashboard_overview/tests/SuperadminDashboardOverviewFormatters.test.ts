// RESPONSIBILITY: Define source-level test coverage for dashboard overview using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_dashboard/dashboard_overview/tests/SuperadminDashboardOverviewFormatters.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { FormatCompactCurrency, FormatCurrency } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/utils/SuperadminDashboardOverviewFormatters';

describe('dashboard currency formatters', () => {
  it('formats minor units with explicit currency and locale', () => {
    expect(FormatCurrency(123456, 'INR', 'en-IN')).toContain('1,234.56');
    expect(FormatCurrency(123456, 'USD', 'en-US')).toContain('1,234.56');
    expect(FormatCurrency(1.5, 'INR', 'en-IN')).toBe('—');
  });
  it('uses compact notation for KPI-scale currency values', () => {
    expect(FormatCompactCurrency(438000000, 'INR', 'en-IN')).toMatch(/43\.8/);
    expect(FormatCompactCurrency(Number.MAX_SAFE_INTEGER + 1, 'INR', 'en-IN')).toBe('—');
  });
  it('uses the four-decimal subunit scale for CLF', () => { expect(FormatCurrency(12345, 'CLF', 'en-US')).toContain('1.2345'); });
});
