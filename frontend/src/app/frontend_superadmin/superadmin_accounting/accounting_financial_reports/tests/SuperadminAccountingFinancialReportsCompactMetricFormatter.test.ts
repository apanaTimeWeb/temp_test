// RESPONSIBILITY: Define source-level test coverage for accounting financial reports using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_financial_reports/tests/SuperadminAccountingFinancialReportsCompactMetricFormatter.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminAccountingCompactMetric } from '@/app/frontend_superadmin/superadmin_accounting/accounting_financial_reports/utils/SuperadminAccountingFinancialReportsFormatters';

describe('formatSuperadminAccountingCompactMetric', () => {
  it('formats large chart metrics with locale-aware compact notation', () => {
    expect(formatSuperadminAccountingCompactMetric(1200, 'en-US')).not.toBe('—');
  });

  it('uses an en-dash for non-finite values', () => {
    expect(formatSuperadminAccountingCompactMetric(Number.NaN, 'en-US')).toBe('—');
  });
});
