import { describe, expect, it } from 'vitest';
import { formatManagerGroupAdmissionCurrency, fromManagerGroupAdmissionMinorUnits, toManagerGroupAdmissionMinorUnits } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionCurrencyFormatting';

describe('ManagerMembersGroupAdmissionCurrencyFormatting', () => {
  it('converts major units to integer minor units without floating-point drift', () => {
    expect(toManagerGroupAdmissionMinorUnits(12.34, 'INR', 'en-IN')).toBe(1234);
  });

  it('formats minor units with the supplied locale and currency', () => {
    expect(formatManagerGroupAdmissionCurrency(123400, 'INR', 'en-IN')).toContain('1,234');
  });

  it('returns a safe fallback for malformed currency codes rather than throwing', () => {
    expect(formatManagerGroupAdmissionCurrency(1000, 'bad', 'en-IN')).toBe('—');
  });

  it('converts integer minor units into a form-friendly major-unit number', () => {
    expect(fromManagerGroupAdmissionMinorUnits(1234, 'INR', 'en-IN')).toBe(12.34);
  });

  it('handles a zero-minor-unit currency without hardcoding a factor of 100', () => {
    expect(fromManagerGroupAdmissionMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(toManagerGroupAdmissionMinorUnits(1500, 'JPY', 'ja-JP')).toBe(1500);
    expect(formatManagerGroupAdmissionCurrency(1234, 'KWD', 'en-US')).toContain('1.234');
    expect(toManagerGroupAdmissionMinorUnits(1.234, 'KWD', 'en-US')).toBe(1234);
  });
});
