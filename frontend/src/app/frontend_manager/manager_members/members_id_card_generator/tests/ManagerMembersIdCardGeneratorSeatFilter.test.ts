import { describe, expect, it } from 'vitest';
import { normalizeManagerIdCardGeneratorSeatFilter } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorSeatFilter';

describe('normalizeManagerIdCardGeneratorSeatFilter', () => {
  it('matches a prefixed seat label with the unprefixed route parameter', () => {
    expect(normalizeManagerIdCardGeneratorSeatFilter('S-12')).toBe(normalizeManagerIdCardGeneratorSeatFilter('12'));
  });

  it('ignores case and surrounding whitespace without changing the seat number', () => {
    expect(normalizeManagerIdCardGeneratorSeatFilter(' s-A12 ')).toBe('a12');
    expect(normalizeManagerIdCardGeneratorSeatFilter('S-012')).not.toBe(normalizeManagerIdCardGeneratorSeatFilter('12'));
  });

  it('returns an empty string for a blank query value', () => {
    expect(normalizeManagerIdCardGeneratorSeatFilter('  ')).toBe('');
  });
});
