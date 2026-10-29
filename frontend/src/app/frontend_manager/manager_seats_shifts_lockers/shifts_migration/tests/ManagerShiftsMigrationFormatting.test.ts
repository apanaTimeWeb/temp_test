import { describe, expect, it } from 'vitest';
import { formatManagerSeatsCurrency, toManagerSeatsMinorUnits } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/utils/ManagerShiftsMigrationFormatting';

describe('ManagerShiftsMigrationFormatting', () => {
  it('formats integer minor units as currency', () => {
    expect(formatManagerSeatsCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('converts entered major units to integer minor units', () => {
    expect(toManagerSeatsMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('respects currency-specific fraction digits', () => {
    expect(formatManagerSeatsCurrency(1500, 'JPY', 'ja-JP')).toContain('1,500');
    expect(toManagerSeatsMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerSeatsCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerSeatsMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });

  it('returns a safe placeholder for invalid display values', () => {
    expect(formatManagerSeatsCurrency(Number.POSITIVE_INFINITY, 'INR', 'en-IN')).toBe('—');
  });
});
