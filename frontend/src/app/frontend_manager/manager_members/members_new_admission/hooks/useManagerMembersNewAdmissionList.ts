'use client';
/** DATA FLOW: Module-owned source data and caller filter inputs -> feature list result; no new API flow is introduced. */

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useManagerNewAdmissionDebounce } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmissionDebounce';
import { useManagerNewAdmission } from '@/app/frontend_manager/manager_members/members_new_admission/hooks/useManagerMembersNewAdmission';
import { normalizeManagerNewAdmissionSeatFilter } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionSeatFilter';
import { readManagerNewAdmissionListUrlState, updateManagerNewAdmissionListUrl, updateManagerNewAdmissionSearchUrl } from '@/app/frontend_manager/manager_members/members_new_admission/utils/ManagerMembersNewAdmissionListUrlState';

export function useManagerNewAdmissionList() {
  const query = useManagerNewAdmission();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const initialUrlState = readManagerNewAdmissionListUrlState(new URLSearchParams(searchParams.toString()));
  const [search, setSearchState] = useState(() => initialUrlState.search);
  const [seatFilter, setSeatFilterState] = useState(() => initialUrlState.seat);
  const [statusFilter, setStatusFilterState] = useState(() => initialUrlState.status);
  const [shiftFilter, setShiftFilterState] = useState(() => initialUrlState.shift);
// Dependency rationale: refresh local filter controls whenever the canonical URL search params change.
  useEffect(() => {
    const state = readManagerNewAdmissionListUrlState(new URLSearchParams(searchParams.toString()));
    setSearchState(state.search); setSeatFilterState(state.seat); setStatusFilterState(state.status); setShiftFilterState(state.shift);
  }, [searchParams]);
  const updateUrlParam = (key: string, value: string, defaultValue = '') => {
    router.replace(updateManagerNewAdmissionListUrl(pathname, searchParams.toString(), key, value, defaultValue), { scroll: false });
  };
  const setSearch = (value: string) => {
    setSearchState(value);
    router.replace(updateManagerNewAdmissionSearchUrl(pathname, searchParams.toString(), value), { scroll: false });
  };
  const setSeatFilter = (value: string) => { setSeatFilterState(value); updateUrlParam('seat', value); };
  const setStatusFilter = (value: string) => { setStatusFilterState(value); updateUrlParam('status', value, 'all'); };
  const setShiftFilter = (value: string) => { setShiftFilterState(value); updateUrlParam('shift', value, 'all'); };
  const debouncedSearch = useManagerNewAdmissionDebounce(search, 300);
  const students = query.data ?? [];

  const filtered = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    const normalizedSeatFilter = normalizeManagerNewAdmissionSeatFilter(seatFilter);
    return students.filter((student) => {
      const matchesSearch = !normalizedSearch
        || student.name.toLowerCase().includes(normalizedSearch)
        || student.phone.toLowerCase().includes(normalizedSearch)
        || student.smartId.toLowerCase().includes(normalizedSearch);
      const normalizedStudentSeat = normalizeManagerNewAdmissionSeatFilter(student.seat);
      const matchesSeat = !normalizedSeatFilter || normalizedStudentSeat === normalizedSeatFilter;
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesShift = shiftFilter === 'all' || student.shift === shiftFilter;
      return matchesSearch && matchesSeat && matchesStatus && matchesShift;
    });
  }, [students, debouncedSearch, seatFilter, statusFilter, shiftFilter]);

  return {
    ...query,
    students,
    filtered,
    search,
    setSearch,
    setSeatFilter,
    seatFilter,
    statusFilter,
    setStatusFilter,
    shiftFilter,
    setShiftFilter,
  };
}
