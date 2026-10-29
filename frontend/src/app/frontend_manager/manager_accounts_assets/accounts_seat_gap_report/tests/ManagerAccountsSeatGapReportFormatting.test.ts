import { describe, expect, it } from 'vitest';
import { formatManagerSeatGapReportCurrency, toManagerSeatGapReportMinorUnits } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/utils/ManagerAccountsSeatGapReportFormatting';

describe('ManagerAccountsSeatGapReportFormatting', () => {
  it('formats integer minor units as currency', () => {
    expect(formatManagerSeatGapReportCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('converts entered major units to minor units', () => {
    expect(toManagerSeatGapReportMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('respects currency-specific fraction digits', () => {
    expect(formatManagerSeatGapReportCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(toManagerSeatGapReportMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerSeatGapReportCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerSeatGapReportMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('returns a safe placeholder for non-finite display values', () => {
    expect(formatManagerSeatGapReportCurrency(Number.NaN, 'INR', 'en-IN')).toBe('—');
  });
});
