// RESPONSIBILITY: Define source-level test coverage for accounting financial reports using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_financial_reports/tests/SuperadminAccountingFinancialReportsQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS } from '../api/superadmin_accounting_financial_reports.query_keys';

describe('accounting_financial_reports canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_accounting', 'accounting_financial_reports']);
    expect(SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_ACCOUNTING_FINANCIAL_REPORTS_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
