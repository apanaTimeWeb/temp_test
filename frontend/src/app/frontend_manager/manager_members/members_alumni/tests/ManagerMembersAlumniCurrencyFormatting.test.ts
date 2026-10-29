import { describe, expect, it } from 'vitest';
import { formatManagerAlumniCurrency, fromManagerAlumniMinorUnits, toManagerAlumniMinorUnits } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniCurrencyFormatting';

describe('ManagerMembersAlumniCurrencyFormatting', () => {
  it('converts major units to integer minor units without floating-point drift', () => {
    expect(toManagerAlumniMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('formats minor units with the supplied locale and currency', () => {
    expect(formatManagerAlumniCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('returns a safe fallback for malformed currency codes rather than throwing', () => {
    expect(formatManagerAlumniCurrency(1000, 'bad', 'en-IN')).toBe('—');
  });

  it('converts integer minor units into a form-friendly major-unit number', () => {
    expect(fromManagerAlumniMinorUnits(1234, 'INR', 'en-IN')).toBe(12.34);
  });

  it('handles a zero-minor-unit currency without hardcoding a factor of 100', () => {
    expect(fromManagerAlumniMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(toManagerAlumniMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerAlumniCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerAlumniMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });
});
