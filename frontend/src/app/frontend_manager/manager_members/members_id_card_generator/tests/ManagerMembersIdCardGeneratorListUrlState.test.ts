import { describe, expect, it } from 'vitest';
import { readManagerIdCardGeneratorListUrlState, updateManagerIdCardGeneratorListUrl, updateManagerIdCardGeneratorSearchUrl } from '@/app/frontend_manager/manager_members/members_id_card_generator/utils/ManagerMembersIdCardGeneratorListUrlState';
import { MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES } from '@/app/frontend_manager/manager_members/members_id_card_generator/config/manager_members_id_card_generator.url_config';

describe('student directory URL state behavior', () => {
  it('routes legacy admission-preview links to the canonical new-admission owner', () => {
    expect(MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW).toBe('/frontend_manager/manager_members/members_new_admission');
    expect(MANAGER_MEMBERS_ID_CARD_GENERATOR_ROUTES.ADMISSION_PREVIEW).not.toContain('view=admission');
  });
  it('reads canonical search and legacy smartId parameters plus filters', () => {
    expect(readManagerIdCardGeneratorListUrlState(new URLSearchParams('smartId=STU-7&seat=A-03&status=Active&shift=Morning'))).toEqual({ search: 'STU-7', seat: 'A-03', status: 'Active', shift: 'Morning' });
    expect(readManagerIdCardGeneratorListUrlState(new URLSearchParams('search=Priya&smartId=ignored')).search).toBe('Priya');
    expect(readManagerIdCardGeneratorListUrlState(new URLSearchParams()).status).toBe('all');
  });
  it('preserves unrelated parameters and removes defaults from the URL', () => {
    expect(updateManagerIdCardGeneratorListUrl('/frontend_manager/manager_members/members_id_card_generator', 'page=2&status=Active', 'shift', 'Morning', 'all')).toBe('/frontend_manager/manager_members/members_id_card_generator?page=2&status=Active&shift=Morning');
    expect(updateManagerIdCardGeneratorListUrl('/frontend_manager/manager_members/members_id_card_generator', 'page=2&status=Active', 'status', 'all', 'all')).toBe('/frontend_manager/manager_members/members_id_card_generator?page=2');
  });
  it('promotes legacy smartId searches to canonical search and removes stale smartId', () => {
    expect(updateManagerIdCardGeneratorSearchUrl('/frontend_manager/manager_members/members_id_card_generator', 'smartId=STU-7&seat=A-03', 'Priya S')).toBe('/frontend_manager/manager_members/members_id_card_generator?seat=A-03&search=Priya+S');
    expect(updateManagerIdCardGeneratorSearchUrl('/frontend_manager/manager_members/members_id_card_generator', 'search=Priya', '')).toBe('/frontend_manager/manager_members/members_id_card_generator');
  });
});
