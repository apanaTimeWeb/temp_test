import { describe, expect, it } from 'vitest';
import { readManagerGroupAdmissionListUrlState, updateManagerGroupAdmissionListUrl, updateManagerGroupAdmissionSearchUrl } from '@/app/frontend_manager/manager_members/members_group_admission/utils/ManagerMembersGroupAdmissionListUrlState';

describe('student directory URL state behavior', () => {
  it('reads canonical search and legacy smartId parameters plus filters', () => {
    expect(readManagerGroupAdmissionListUrlState(new URLSearchParams('smartId=STU-7&seat=A-03&status=Active&shift=Morning'))).toEqual({ search: 'STU-7', seat: 'A-03', status: 'Active', shift: 'Morning' });
    expect(readManagerGroupAdmissionListUrlState(new URLSearchParams('search=Priya&smartId=ignored')).search).toBe('Priya');
    expect(readManagerGroupAdmissionListUrlState(new URLSearchParams()).status).toBe('all');
  });
  it('preserves unrelated parameters and removes defaults from the URL', () => {
    expect(updateManagerGroupAdmissionListUrl('/frontend_manager/manager_members/members_group_admission', 'page=2&status=Active', 'shift', 'Morning', 'all')).toBe('/frontend_manager/manager_members/members_group_admission?page=2&status=Active&shift=Morning');
    expect(updateManagerGroupAdmissionListUrl('/frontend_manager/manager_members/members_group_admission', 'page=2&status=Active', 'status', 'all', 'all')).toBe('/frontend_manager/manager_members/members_group_admission?page=2');
  });
  it('promotes legacy smartId searches to canonical search and removes stale smartId', () => {
    expect(updateManagerGroupAdmissionSearchUrl('/frontend_manager/manager_members/members_group_admission', 'smartId=STU-7&seat=A-03', 'Priya S')).toBe('/frontend_manager/manager_members/members_group_admission?seat=A-03&search=Priya+S');
    expect(updateManagerGroupAdmissionSearchUrl('/frontend_manager/manager_members/members_group_admission', 'search=Priya', '')).toBe('/frontend_manager/manager_members/members_group_admission');
  });
});
