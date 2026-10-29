import { describe, expect, it } from 'vitest';
import { normalizeManagerNewAdmissionSeatFilter } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionSeatFilter';

describe('normalizeManagerNewAdmissionSeatFilter', () => {
  it('matches a prefixed seat label with the unprefixed route parameter', () => {
    expect(normalizeManagerNewAdmissionSeatFilter('S-12')).toBe(normalizeManagerNewAdmissionSeatFilter('12'));
  });

  it('ignores case and surrounding whitespace without changing the seat number', () => {
    expect(normalizeManagerNewAdmissionSeatFilter(' s-A12 ')).toBe('a12');
    expect(normalizeManagerNewAdmissionSeatFilter('S-012')).not.toBe(normalizeManagerNewAdmissionSeatFilter('12'));
  });

  it('returns an empty string for a blank query value', () => {
    expect(normalizeManagerNewAdmissionSeatFilter('  ')).toBe('');
  });
});
