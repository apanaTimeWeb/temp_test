// RESPONSIBILITY: Define source-level test coverage for accounting expenses using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expenses/tests/SuperadminAccountingExpensesQueryKeys.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS } from '../api/superadmin_accounting_expenses.query_keys';

describe('accounting_expenses canonical query-key namespace', () => {
  it('keeps list and detail cache keys scoped to the owning leaf', () => {
    const filters = { status: 'active', page: 1 } as const;
    expect(SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS.all).toEqual(['superadmin', 'superadmin_accounting', 'accounting_expenses']);
    expect(SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS.list(filters)).toEqual([...SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS.all, 'list', filters]);
    expect(SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS.detail('record-id')).toEqual([...SUPERADMIN_ACCOUNTING_EXPENSES_QUERY_KEYS.all, 'detail', 'record-id']);
  });
});
