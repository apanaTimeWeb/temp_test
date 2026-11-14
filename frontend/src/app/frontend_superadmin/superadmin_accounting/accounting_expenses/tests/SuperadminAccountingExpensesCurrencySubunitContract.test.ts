// RESPONSIBILITY: Define source-level test coverage for accounting expenses using declared fixtures/contracts; it does not claim host runtime execution.
// FLOW: Test runner -> superadmin_accounting/accounting_expenses/tests/SuperadminAccountingExpensesCurrencySubunitContract.test.ts -> module-local test harness/fixtures -> assertions and regression evidence.
import { describe, expect, it } from 'vitest';
import { formatSuperadminAccountingCurrency } from '@/app/frontend_superadmin/superadmin_accounting/accounting_expenses/utils/SuperadminAccountingExpensesFormatters';

describe('formatSuperadminAccountingCurrency currency subunit contract', () => {
  it('formats a supported zero-decimal currency without a two-decimal fallback', () => {
    expect(formatSuperadminAccountingCurrency(1234, 'JPY', 'en-US')).not.toBe('—');
  });

  it('does not guess a divisor for an unsupported currency code', () => {
    expect(formatSuperadminAccountingCurrency(1234, 'ZZZ', 'en-US')).toBe('—');
  });
});
