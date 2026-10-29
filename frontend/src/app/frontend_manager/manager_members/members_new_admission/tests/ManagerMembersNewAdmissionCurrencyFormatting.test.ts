import { describe, expect, it } from 'vitest';
import { formatManagerNewAdmissionCurrency, fromManagerNewAdmissionMinorUnits, toManagerNewAdmissionMinorUnits } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionCurrencyFormatting';

describe('ManagerMembersNewAdmissionCurrencyFormatting', () => {
  it('converts major units to integer minor units without floating-point drift', () => {
    expect(toManagerNewAdmissionMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('formats minor units with the supplied locale and currency', () => {
    expect(formatManagerNewAdmissionCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('returns a safe fallback for malformed currency codes rather than throwing', () => {
    expect(formatManagerNewAdmissionCurrency(1000, 'bad', 'en-IN')).toBe('—');
  });

  it('converts integer minor units into a form-friendly major-unit number', () => {
    expect(fromManagerNewAdmissionMinorUnits(1234, 'INR', 'en-IN')).toBe(12.34);
  });

  it('handles a zero-minor-unit currency without hardcoding a factor of 100', () => {
    expect(fromManagerNewAdmissionMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(toManagerNewAdmissionMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerNewAdmissionCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerNewAdmissionMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });
});
