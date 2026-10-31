import { useEffect, useMemo, useState } from 'react';
import { getManagerMemberDirectoryDemoRecords } from '@/app/frontend_manager/manager_members/members_directory/mocks/manager_members_directory_fixtures/ManagerMembersDirectoryDemoRepository';
import type { ManagerMembersDirectoryRecord, ManagerMembersDirectoryTab } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { MANAGER_MEMBERS_DIRECTORY_SEARCH_DEBOUNCE_MS } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';

/** DATA FLOW: Feature-owned inputs/state -> hook result for its caller; no backend/API flow is inferred without source evidence. */

/** Owns the member-directory filters and query-driven profile selection state. */
export type ManagerMembersDirectoryRouteIntent = { view?: string; id?: string; name?: string; phone?: string; smartId?: string; seat?: string };

function resolveProfileQuery(intent: ManagerMembersDirectoryRouteIntent): string {
  return (intent.id ?? intent.smartId ?? intent.name ?? intent.phone ?? '').trim();
}

export function useManagerMemberDirectoryPageState(routeIntent: ManagerMembersDirectoryRouteIntent = {}) {
  const hasProfileIntent = routeIntent.view === 'profile' || routeIntent.view === 'edit';
  const [activeTab, setActiveTab] = useState<ManagerMembersDirectoryTab>(hasProfileIntent ? 'Member Profile' : 'All Members');
  const [searchQuery, setSearchQuery] = useState(routeIntent.seat ? routeIntent.seat.trim() : '');
  const [profileSearch, setProfileSearch] = useState(hasProfileIntent ? resolveProfileQuery(routeIntent) : 'LIB-001');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  const [debouncedProfileSearch, setDebouncedProfileSearch] = useState(profileSearch);
  // Dependency rationale: debounce the general directory search independently (300ms) so rapid edits do not trigger repeated filtering.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => window.clearTimeout(timeout);
  }, [searchQuery]);
  // Dependency rationale: debounce profile search independently (300ms) because it has a separate field and result intent.
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedProfileSearch(profileSearch), 300);
    return () => window.clearTimeout(timeout);
  }, [profileSearch]);

  // Dependency rationale: synchronize the active tab and profile query with the current route intent; every route field used below is in the dependency list.
  useEffect(() => {
    if (routeIntent.seat) {
      setActiveTab('All Members');
      setSearchQuery(routeIntent.seat.trim());
    } else if (routeIntent.view === 'profile' || routeIntent.view === 'edit') {
      setActiveTab('Member Profile');
      setProfileSearch(resolveProfileQuery(routeIntent));
    } else if (routeIntent.view === undefined) {
      setActiveTab('All Members');
      setProfileSearch('LIB-001');
    }
  }, [routeIntent.view, routeIntent.id, routeIntent.name, routeIntent.phone, routeIntent.smartId, routeIntent.seat]);
  const members: ManagerMembersDirectoryRecord[] = useMemo(() => getManagerMemberDirectoryDemoRecords(), []);

  const filteredMembers = useMemo(() => {
    let filtered = members;
    if (activeTab === 'Active Members') filtered = filtered.filter((member) => member.status === 'Active');
    if (activeTab === 'Expired Members') filtered = filtered.filter((member) => member.status === 'Expired');
    if (activeTab === 'Suspended Members') filtered = filtered.filter((member) => member.status === 'Suspended');
    if (debouncedSearchQuery) {
      const normalizedQuery = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter((member) => (
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.id.toLowerCase().includes(normalizedQuery) ||
        (member.seat && member.seat.toLowerCase().includes(normalizedQuery))
      ));
    }
    return filtered;
  }, [activeTab, members, debouncedSearchQuery]);

  const profileMember = useMemo(
    () => members.find((record) => `${record.id} ${record.name}`.toLowerCase().includes(debouncedProfileSearch.trim().toLowerCase())) ?? null,
    [members, debouncedProfileSearch],
  );

  return { activeTab, setActiveTab, searchQuery, setSearchQuery, profileSearch, setProfileSearch, members, filteredMembers, profileMember };
}
