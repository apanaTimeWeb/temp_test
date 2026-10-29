import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDate, formatDateTime, toMinorUnits } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/utils/ManagerFinanceAutoSuspendFormatting';

describe('ManagerFinanceAutoSuspendFormatting', () => {
  it('formats integer minor units using the supplied currency and locale', () => {
    expect(formatCurrency(150000, 'INR', 'en-IN')).toContain('1,500');
  });

  it('converts user-entered major units into integer minor units', () => {
    expect(toMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('does not assume two decimal places for zero-minor-unit currencies', () => {
    expect(formatCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(formatCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('preserves ISO date-only calendar values when formatting', () => {
    expect(formatDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatDate('2026-10-17', 'en-GB')).toContain('2026');
  });

  it('returns the documented fallback marker for an invalid date', () => {
    expect(formatDate('not-a-date', 'en-IN')).toBe('—');
  });

  it('formats date-time values with the supplied locale and rejects invalid values', () => {
    expect(formatDateTime('2026-10-17T09:30:00Z', 'en-GB')).toContain('2026');
    expect(formatDateTime('not-a-date', 'en-IN')).toBe('—');
  });
});
