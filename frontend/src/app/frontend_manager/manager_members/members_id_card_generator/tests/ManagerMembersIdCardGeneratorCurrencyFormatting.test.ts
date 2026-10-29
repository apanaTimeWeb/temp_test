import { describe, expect, it } from 'vitest';
import { formatManagerIdCardGeneratorCurrency, fromManagerIdCardGeneratorMinorUnits, toManagerIdCardGeneratorMinorUnits } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorCurrencyFormatting';

describe('ManagerMembersIdCardGeneratorCurrencyFormatting', () => {
  it('converts major units to integer minor units without floating-point drift', () => {
    expect(toManagerIdCardGeneratorMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('formats minor units with the supplied locale and currency', () => {
    expect(formatManagerIdCardGeneratorCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('returns a safe fallback for malformed currency codes rather than throwing', () => {
    expect(formatManagerIdCardGeneratorCurrency(1000, 'bad', 'en-IN')).toBe('—');
  });

  it('converts integer minor units into a form-friendly major-unit number', () => {
    expect(fromManagerIdCardGeneratorMinorUnits(1234, 'INR', 'en-IN')).toBe(12.34);
  });

  it('handles a zero-minor-unit currency without hardcoding a factor of 100', () => {
    expect(fromManagerIdCardGeneratorMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(toManagerIdCardGeneratorMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerIdCardGeneratorCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerIdCardGeneratorMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });
});
