import { describe, expect, it } from 'vitest';
import { normalizeManagerAlumniSeatFilter } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniSeatFilter';

describe('normalizeManagerAlumniSeatFilter', () => {
  it('matches a prefixed seat label with the unprefixed route parameter', () => {
    expect(normalizeManagerAlumniSeatFilter('S-12')).toBe(normalizeManagerAlumniSeatFilter('12'));
  });

  it('ignores case and surrounding whitespace without changing the seat number', () => {
    expect(normalizeManagerAlumniSeatFilter(' s-A12 ')).toBe('a12');
    expect(normalizeManagerAlumniSeatFilter('S-012')).not.toBe(normalizeManagerAlumniSeatFilter('12'));
  });

  it('returns an empty string for a blank query value', () => {
    expect(normalizeManagerAlumniSeatFilter('  ')).toBe('');
  });
});
