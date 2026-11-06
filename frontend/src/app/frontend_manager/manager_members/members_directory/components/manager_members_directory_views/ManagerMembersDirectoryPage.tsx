'use client';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { ManagerMembersDirectorySupportingSections } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectorySupportingSections';
import { ManagerMembersDirectoryKpiSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryKpiSection';
import { ManagerMembersDirectoryHeader } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryHeader';
import { useManagerMemberDirectoryPageState } from '@/app/frontend_manager/manager_members/members_directory/hooks/useManagerMembersDirectoryPageState';
import { ManagerMembersDirectoryProfileSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryProfileSection';
import type { ManagerMembersDirectoryRouteQueryProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';
import {
  ManagerMembersDirectoryTable,
  type MemberSortField,
} from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryTable';
import ManagerMembersDirectoryTimeHorizonBar, { type ManagerMembersTimeHorizon } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryTimeHorizonBar';
import ManagerMembersDirectoryStatusTabs from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryStatusTabs';

export default function ManagerMembersDirectoryPage(_routeQuery: ManagerMembersDirectoryRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    profileSearch,
    setProfileSearch,
    members,
    filteredMembers,
    profileMember,
    updateMember,
  } = useManagerMemberDirectoryPageState(_routeQuery);
  const editIntent = _routeQuery.view === 'edit';

  const [timeHorizon, setTimeHorizon] = useState<ManagerMembersTimeHorizon>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [planFilter, setPlanFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [sortField, setSortField] = useState<MemberSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleSort = (field: MemberSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const timeFilteredMembers = useMemo(() => {
    if (timeHorizon === 'all') return filteredMembers;
    const now = new Date('2026-04-15T12:00:00Z');
    return filteredMembers.filter((m) => {
      const recDate = new Date(m.joinDate);
      if (isNaN(recDate.getTime())) return true;
      if (timeHorizon === 'today') return recDate.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
      if (timeHorizon === 'this_week') {
        const diffDays = (now.getTime() - recDate.getTime()) / (1000 * 3600 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (timeHorizon === 'this_month') return recDate.getFullYear() === now.getFullYear() && recDate.getMonth() === now.getMonth();
      if (timeHorizon === 'custom') {
        const dateStr = recDate.toISOString().slice(0, 10);
        if (customStartDate && dateStr < customStartDate) return false;
        if (customEndDate && dateStr > customEndDate) return false;
        return true;
      }
      return true;
    });
  }, [filteredMembers, timeHorizon, customStartDate, customEndDate]);

  const timeHorizonLabel = useMemo(() => {
    switch (timeHorizon) {
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'this_month': return 'This Month';
      case 'custom': return customStartDate && customEndDate ? `${customStartDate} - ${customEndDate}` : 'Custom Range';
      default: return 'All Members';
    }
  }, [timeHorizon, customStartDate, customEndDate]);

  const multiFilteredMembers = useMemo(() => {
    return timeFilteredMembers.filter((m) => {
      if (planFilter !== 'all' && m.type !== planFilter) return false;
      if (shiftFilter !== 'all' && m.shift !== shiftFilter) return false;
      if (genderFilter !== 'all' && m.gender !== genderFilter) return false;
      if (expiryFilter !== 'all') {
        const today = new Date();
        const expiry = new Date(m.expiryDate);
        const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (expiryFilter === '7days' && (diffDays < 0 || diffDays > 7)) return false;
        if (expiryFilter === '30days' && (diffDays < 0 || diffDays > 30)) return false;
      }
      return true;
    });
  }, [timeFilteredMembers, planFilter, shiftFilter, genderFilter, expiryFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    planFilter !== 'all' ||
    shiftFilter !== 'all' ||
    genderFilter !== 'all' ||
    expiryFilter !== 'all' ||
    timeHorizon !== 'all' ||
    activeTab !== 'All Members';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setShiftFilter('all');
    setGenderFilter('all');
    setExpiryFilter('all');
    setTimeHorizon('all');
    setActiveTab('All Members');
    setPage(0);
  };

  const sortedMembers = useMemo(() => {
    if (!sortField) return multiFilteredMembers;
    return [...multiFilteredMembers].sort((a, b) => {
      const aVal = String(a[sortField] ?? '');
      const bVal = String(b[sortField] ?? '');
      const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [multiFilteredMembers, sortField, sortDirection]);

  const totalRows = sortedMembers.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginatedMembers = sortedMembers.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  const handleExportCsv = () => {
    const headers = 'Member ID,Name,Phone,Plan,Status,Expiry Date\n';
    const rows = sortedMembers
      .map((m) => `"${m.id}","${m.name}","${m.phone}","${m.type}","${m.status}","${m.expiryDate}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `students_directory_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="mgr-page-animate relative pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
      data-route-seat={_routeQuery.seat}
    >
      <ManagerMembersDirectoryHeader />
      <p
        role="status"
        data-testid="manager-members-demo-mode-banner"
        className="mb-5 rounded-xl border border-warning bg-warning-bg px-4 py-3 text-sm text-warning"
      >
        {tManagerUi('demo_mode_existing_members_are_sample_records_new_member_014d0f')}
      </p>

      <ManagerMembersDirectoryTimeHorizonBar
        timeHorizon={timeHorizon}
        onChangeTimeHorizon={setTimeHorizon}
        customStartDate={customStartDate}
        onCustomStartDateChange={setCustomStartDate}
        customEndDate={customEndDate}
        onCustomEndDateChange={setCustomEndDate}
        activeCount={multiFilteredMembers.length}
      />

      <ManagerMembersDirectoryKpiSection
        totalMembers={timeFilteredMembers.length}
        activeMembers={timeFilteredMembers.filter((m) => m.status === 'Active').length}
        expiredMembers={timeFilteredMembers.filter((m) => m.status === 'Expired').length}
        suspendedMembers={timeFilteredMembers.filter((m) => m.status === 'Suspended').length}
        activeTab={activeTab}
        timeHorizonLabel={timeHorizonLabel}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setPage(0);
        }}
      />

      {/* ── Main Full-Width Content Card ── */}
      <div className="mgr-card p-6 min-h-96 w-full shadow-card border border-border">
        {/* GRIDS (All, Active, Expired, Suspended) */}
        {['All Members', 'Active Members', 'Expired Members', 'Suspended Members'].includes(activeTab) && (
          <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
            <ManagerMembersDirectoryStatusTabs
              activeTab={activeTab as any}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setPage(0);
              }}
              members={timeFilteredMembers}
              onExportCsv={handleExportCsv}
            />

            {/* Table and Filter Bar */}
            <ManagerMembersDirectoryTable
              sortedMembers={sortedMembers}
              paginatedMembers={paginatedMembers}
              totalRows={totalRows}
              searchQuery={searchQuery}
              setSearchQuery={(val) => {
                setSearchQuery(val);
                setPage(0);
              }}
              planFilter={planFilter}
              setPlanFilter={(val) => {
                setPlanFilter(val);
                setPage(0);
              }}
              shiftFilter={shiftFilter}
              setShiftFilter={(val) => {
                setShiftFilter(val);
                setPage(0);
              }}
              genderFilter={genderFilter}
              setGenderFilter={(val) => {
                setGenderFilter(val);
                setPage(0);
              }}
              expiryFilter={expiryFilter}
              setExpiryFilter={(val) => {
                setExpiryFilter(val);
                setPage(0);
              }}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              onSelectMemberProfile={(memberId) => {
                setProfileSearch(memberId);
                setActiveTab('Member Profile');
              }}
              page={page}
              pageSize={pageSize}
              pageCount={pageCount}
              startItem={startItem}
              endItem={endItem}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize);
                setPage(0);
              }}
            />
          </div>
        )}

        {/* MEMBER PROFILE */}
        {activeTab === 'Member Profile' && (
          <ManagerMembersDirectoryProfileSection
            searchValue={profileSearch}
            onSearchChange={setProfileSearch}
            member={profileMember}
            onUpdateMember={updateMember}
            initialEdit={editIntent}
            onBack={() => setActiveTab('All Members')}
          />
        )}

        <ManagerMembersDirectorySupportingSections activeTab={activeTab} />
      </div>
    </div>
  );
}
