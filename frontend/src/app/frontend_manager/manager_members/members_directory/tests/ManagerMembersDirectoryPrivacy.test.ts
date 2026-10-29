import { describe, expect, it } from 'vitest';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';

describe('maskManagerMemberPhone', () => {
  it('reveals only the final four digits for a phone with formatting', () => {
    expect(maskManagerMemberPhone('+91 98765-43210')).toBe('••••••••3210');
  });

  it('does not reveal values with four or fewer digits', () => {
    expect(maskManagerMemberPhone('1234')).toBe('••••');
    expect(maskManagerMemberPhone('12-3')).toBe('••••');
  });

  it('uses an en dash for a missing value', () => {
    expect(maskManagerMemberPhone(undefined)).toBe('—');
    expect(maskManagerMemberPhone('   ')).toBe('—');
  });

  it('does not mutate or return the original full phone number', () => {
    const source = '+91 98765 43210';
    const masked = maskManagerMemberPhone(source);
    expect(source).toBe('+91 98765 43210');
    expect(masked).not.toContain('98765');
    expect(masked.endsWith('3210')).toBe(true);
  });

  it('does not expose non-digit text as if it were a phone number', () => {
    expect(maskManagerMemberPhone('not provided')).toBe('not provided');
  });
});
