import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { describe,expect,it } from 'vitest';

describe('ManagerMemberDirectory display formatting', () => {
  it('uses a consistent nullable fallback and local calendar date semantics', () => {
    expect(displayValue(null)).toBe('—');
    expect(displayValue({ value: 'bad' })).toBe('—');
    expect(formatManagerMemberDirectoryCalendarDate('2026-10-17', 'en-GB')).toContain('17');
    expect(formatManagerMemberDirectoryCalendarDate('', 'en-GB')).toBe('—');
  });
});
