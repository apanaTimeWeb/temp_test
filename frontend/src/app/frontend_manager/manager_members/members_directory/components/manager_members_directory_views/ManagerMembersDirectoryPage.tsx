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
import { ManagerMembersDirectoryBulkToolbar } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryBulkToolbar';
import { ManagerMembersDirectoryBulkWhatsAppModal } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryBulkWhatsAppModal';
import { useManagerMembersDirectoryBulkWhatsApp } from '@/app/frontend_manager/manager_members/members_directory/hooks/useManagerMembersDirectoryBulkWhatsApp';
import { useManagerMembersDirectoryTimeFilter } from '@/app/frontend_manager/manager_members/members_directory/hooks/useManagerMembersDirectoryTimeFilter';

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

  const {
    timeHorizon,
    setTimeHorizon,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    timeFilteredMembers,
    timeHorizonLabel,
  } = useManagerMembersDirectoryTimeFilter(filteredMembers);

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
    Boolean(customStartDate) ||
    Boolean(customEndDate) ||
    activeTab !== 'All Members';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setShiftFilter('all');
    setGenderFilter('all');
    setExpiryFilter('all');
    setTimeHorizon('all');
    setCustomStartDate('');
    setCustomEndDate('');
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

  const {
    selectedIds,
    selectedMembers,
    isModalOpen,
    setIsModalOpen,
    toggleSelectOne,
    toggleSelectAll,
    selectAllFiltered,
    clearSelection,
    quickWhatsApp,
  } = useManagerMembersDirectoryBulkWhatsApp(members, paginatedMembers, sortedMembers);

  const escapeCsvVal = (val: unknown): string => {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : `"${s}"`;
  };

  const handleExportCsv = () => {
    const headers = ['Member ID', 'Name', 'Phone', 'Plan', 'Status', 'Expiry Date'];
    const rows = sortedMembers.map((m) => [
      escapeCsvVal(m.id),
      escapeCsvVal(m.name),
      escapeCsvVal(m.phone),
      escapeCsvVal(m.type),
      escapeCsvVal(m.status),
      escapeCsvVal(m.expiryDate),
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\r\n');
    const anchor = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' })),
      download: `students_directory_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <div
      className="mgr-page-animate relative pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
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
              activeTab={activeTab}
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
              setSearchQuery={(val) => { setSearchQuery(val); setPage(0); }}
              planFilter={planFilter}
              setPlanFilter={(val) => { setPlanFilter(val); setPage(0); }}
              shiftFilter={shiftFilter}
              setShiftFilter={(val) => { setShiftFilter(val); setPage(0); }}
              genderFilter={genderFilter}
              setGenderFilter={(val) => { setGenderFilter(val); setPage(0); }}
              expiryFilter={expiryFilter}
              setExpiryFilter={(val) => { setExpiryFilter(val); setPage(0); }}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              sortField={sortField}
              sortDirection={sortDirection}
              onToggleSort={toggleSort}
              onSelectMemberProfile={(memberId) => {
                setProfileSearch(memberId);
                setActiveTab('Member Profile');
              }}
              selectedIds={selectedIds}
              onToggleSelectOne={toggleSelectOne}
              onToggleSelectAll={toggleSelectAll}
              onQuickWhatsApp={quickWhatsApp}
              page={page}
              pageSize={pageSize}
              pageCount={pageCount}
              startItem={startItem}
              endItem={endItem}
              onPageChange={setPage}
              onPageSizeChange={(newSize) => { setPageSize(newSize); setPage(0); }}
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

      <ManagerMembersDirectoryBulkToolbar
        selectedCount={selectedIds.length}
        totalFilteredCount={sortedMembers.length}
        onClearSelection={clearSelection}
        onSelectAllFiltered={selectAllFiltered}
        onOpenBulkWhatsApp={() => setIsModalOpen(true)}
      />

      <ManagerMembersDirectoryBulkWhatsAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        members={selectedMembers}
        onComplete={() => {
          setIsModalOpen(false);
          clearSelection();
        }}
      />
    </div>
  );
}
