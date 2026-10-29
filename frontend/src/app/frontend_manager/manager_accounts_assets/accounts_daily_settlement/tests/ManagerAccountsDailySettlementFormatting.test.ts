import { describe, expect, it } from 'vitest';
import { formatManagerDailySettlementCurrency, toManagerDailySettlementMinorUnits } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/utils/ManagerAccountsDailySettlementFormatting';

describe('ManagerAccountsDailySettlementFormatting', () => {
  it('formats integer minor units as currency', () => {
    expect(formatManagerDailySettlementCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('converts entered major units to minor units', () => {
    expect(toManagerDailySettlementMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('respects currency-specific fraction digits', () => {
    expect(formatManagerDailySettlementCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(toManagerDailySettlementMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerDailySettlementCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerDailySettlementMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('returns a safe placeholder for non-finite display values', () => {
    expect(formatManagerDailySettlementCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
