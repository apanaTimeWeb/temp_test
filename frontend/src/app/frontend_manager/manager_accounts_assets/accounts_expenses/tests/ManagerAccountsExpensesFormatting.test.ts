import { describe, expect, it } from 'vitest';
import { formatManagerExpensesCurrency, toManagerExpensesMinorUnits } from '@/app/frontend_manager/manager_accounts_assets/accounts_expenses/utils/ManagerAccountsExpensesFormatting';

describe('ManagerAccountsExpensesFormatting', () => {
  it('formats integer minor units as currency', () => {
    expect(formatManagerExpensesCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('converts entered major units to minor units', () => {
    expect(toManagerExpensesMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('respects currency-specific fraction digits', () => {
    expect(formatManagerExpensesCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(toManagerExpensesMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerExpensesCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerExpensesMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('returns a safe placeholder for non-finite display values', () => {
    expect(formatManagerExpensesCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
