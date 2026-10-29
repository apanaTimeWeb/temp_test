import { describe, expect, it } from 'vitest';
import { readManagerNewAdmissionListUrlState, updateManagerNewAdmissionListUrl, updateManagerNewAdmissionSearchUrl } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionListUrlState';

describe('student directory URL state behavior', () => {
  it('reads canonical search and legacy smartId parameters plus filters', () => {
    expect(readManagerNewAdmissionListUrlState(new URLSearchParams('smartId=STU-7&seat=A-03&status=Active&shift=Morning'))).toEqual({ search: 'STU-7', seat: 'A-03', status: 'Active', shift: 'Morning' });
    expect(readManagerNewAdmissionListUrlState(new URLSearchParams('search=Priya&smartId=ignored')).search).toBe('Priya');
    expect(readManagerNewAdmissionListUrlState(new URLSearchParams()).status).toBe('all');
  });
  it('preserves unrelated parameters and removes defaults from the URL', () => {
    expect(updateManagerNewAdmissionListUrl('/frontend_manager/manager_members/members_new_admission', 'page=2&status=Active', 'shift', 'Morning', 'all')).toBe('/frontend_manager/manager_members/members_new_admission?page=2&status=Active&shift=Morning');
    expect(updateManagerNewAdmissionListUrl('/frontend_manager/manager_members/members_new_admission', 'page=2&status=Active', 'status', 'all', 'all')).toBe('/frontend_manager/manager_members/members_new_admission?page=2');
  });
  it('promotes legacy smartId searches to canonical search and removes stale smartId', () => {
    expect(updateManagerNewAdmissionSearchUrl('/frontend_manager/manager_members/members_new_admission', 'smartId=STU-7&seat=A-03', 'Priya S')).toBe('/frontend_manager/manager_members/members_new_admission?seat=A-03&search=Priya+S');
    expect(updateManagerNewAdmissionSearchUrl('/frontend_manager/manager_members/members_new_admission', 'search=Priya', '')).toBe('/frontend_manager/manager_members/members_new_admission');
  });
});
