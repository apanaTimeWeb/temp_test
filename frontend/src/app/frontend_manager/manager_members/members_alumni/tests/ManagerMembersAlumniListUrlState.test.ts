import { describe, expect, it } from 'vitest';
import { readManagerAlumniListUrlState, updateManagerAlumniListUrl, updateManagerAlumniSearchUrl } from '@/app/frontend_manager/manager_members/members_alumni/utils/ManagerMembersAlumniListUrlState';

describe('student directory URL state behavior', () => {
  it('reads canonical search and legacy smartId parameters plus filters', () => {
    expect(readManagerAlumniListUrlState(new URLSearchParams('smartId=STU-7&seat=A-03&status=Active&shift=Morning'))).toEqual({ search: 'STU-7', seat: 'A-03', status: 'Active', shift: 'Morning' });
    expect(readManagerAlumniListUrlState(new URLSearchParams('search=Priya&smartId=ignored')).search).toBe('Priya');
    expect(readManagerAlumniListUrlState(new URLSearchParams()).status).toBe('all');
  });
  it('preserves unrelated parameters and removes defaults from the URL', () => {
    expect(updateManagerAlumniListUrl('/frontend_manager/manager_members/members_alumni', 'page=2&status=Active', 'shift', 'Morning', 'all')).toBe('/frontend_manager/manager_members/members_alumni?page=2&status=Active&shift=Morning');
    expect(updateManagerAlumniListUrl('/frontend_manager/manager_members/members_alumni', 'page=2&status=Active', 'status', 'all', 'all')).toBe('/frontend_manager/manager_members/members_alumni?page=2');
  });
  it('promotes legacy smartId searches to canonical search and removes stale smartId', () => {
    expect(updateManagerAlumniSearchUrl('/frontend_manager/manager_members/members_alumni', 'smartId=STU-7&seat=A-03', 'Priya S')).toBe('/frontend_manager/manager_members/members_alumni?seat=A-03&search=Priya+S');
    expect(updateManagerAlumniSearchUrl('/frontend_manager/manager_members/members_alumni', 'search=Priya', '')).toBe('/frontend_manager/manager_members/members_alumni');
  });
});
