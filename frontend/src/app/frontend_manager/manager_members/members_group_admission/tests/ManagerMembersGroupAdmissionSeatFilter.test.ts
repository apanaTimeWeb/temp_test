import { describe, expect, it } from 'vitest';
import { normalizeManagerGroupAdmissionSeatFilter } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionSeatFilter';

describe('normalizeManagerGroupAdmissionSeatFilter', () => {
  it('matches a prefixed seat label with the unprefixed route parameter', () => {
    expect(normalizeManagerGroupAdmissionSeatFilter('S-12')).toBe(normalizeManagerGroupAdmissionSeatFilter('12'));
  });

  it('ignores case and surrounding whitespace without changing the seat number', () => {
    expect(normalizeManagerGroupAdmissionSeatFilter(' s-A12 ')).toBe('a12');
    expect(normalizeManagerGroupAdmissionSeatFilter('S-012')).not.toBe(normalizeManagerGroupAdmissionSeatFilter('12'));
  });

  it('returns an empty string for a blank query value', () => {
    expect(normalizeManagerGroupAdmissionSeatFilter('  ')).toBe('');
  });
});
