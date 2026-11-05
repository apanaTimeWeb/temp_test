'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';

import { Eye, Search, ArrowUpDown, ArrowUp, ArrowDown, Download, X } from 'lucide-react';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { ManagerMembersDirectoryEmptyState } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_states/ManagerMembersDirectoryEmptyState';
import { ManagerMembersDirectorySupportingSections } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectorySupportingSections';
import { ManagerMembersDirectoryKpiSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryKpiSection';
import { ManagerMembersDirectoryHeader } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryHeader';
import { MANAGER_MEMBERS_STATUS_BADGES, MANAGER_MEMBERS_TABS, MANAGER_MEMBERSHIP_TYPE_OPTIONS, MANAGER_MEMBERS_GENDER_OPTIONS } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import { useManagerMemberDirectoryPageState } from '@/app/frontend_manager/manager_members/members_directory/hooks/useManagerMembersDirectoryPageState';
import { ManagerMembersDirectoryProfileSection } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryProfileSection';
import type { ManagerMembersDirectoryRouteQueryProps } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryComponentTypes';

export default function ManagerMembersDirectoryPage(_routeQuery: ManagerMembersDirectoryRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, profileSearch, setProfileSearch, members, filteredMembers, profileMember, updateMember } = useManagerMemberDirectoryPageState(_routeQuery);
  const editIntent = _routeQuery.view === 'edit';

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [planFilter, setPlanFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');

  type MemberSortField = 'id' | 'name' | 'phone' | 'type' | 'status' | 'expiryDate';
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
    return filteredMembers.filter((m) => {
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
  }, [filteredMembers, planFilter, shiftFilter, genderFilter, expiryFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    planFilter !== 'all' ||
    shiftFilter !== 'all' ||
    genderFilter !== 'all' ||
    expiryFilter !== 'all' ||
    activeTab !== 'All Members';

  const handleResetFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setShiftFilter('all');
    setGenderFilter('all');
    setExpiryFilter('all');
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

  const renderSortableHeader = (field: MemberSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="px-3 py-3"
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            ) : (
              <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <div className="mgr-page-animate relative pb-12"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}
      data-route-seat={_routeQuery.seat}>
      <ManagerMembersDirectoryHeader />
      <p role="status" data-testid="manager-members-demo-mode-banner" className="mb-5 rounded-xl border border-warning bg-warning-bg px-4 py-3 text-sm text-warning">
        {tManagerUi('demo_mode_existing_members_are_sample_records_new_member_014d0f')}
      </p>

      <ManagerMembersDirectoryKpiSection
        totalMembers={members.length}
        activeMembers={members.filter(m => m.status === 'Active').length}
        expiredMembers={members.filter(m => m.status === 'Expired').length}
        suspendedMembers={members.filter(m => m.status === 'Suspended').length}
        activeTab={activeTab}
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
            
            {/* ── Header Row: Horizontal Segmented Tab Control + Export CSV ── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 border-b border-border pb-4">
              {/* Horizontal Segmented Tabs with Counts */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-highlight/70 rounded-xl border border-border">
                {MANAGER_MEMBERS_TABS.map((tab) => {
                  const isActive = activeTab === tab.name;
                  const count =
                    tab.name === 'All Members'
                      ? members.length
                      : tab.name === 'Active Members'
                      ? members.filter((m) => m.status === 'Active').length
                      : tab.name === 'Expired Members'
                      ? members.filter((m) => m.status === 'Expired').length
                      : members.filter((m) => m.status === 'Suspended').length;

                  return (
                    <button
                      key={tab.name}
                      type="button"
                      onClick={() => { setActiveTab(tab.name); setPage(0); }}
                      aria-pressed={isActive}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-card text-primary shadow-xs border border-border'
                          : 'text-secondary hover:text-primary hover:bg-card/50'
                      }`}
                    >
                      <tab.icon size={15} aria-hidden="true" className={isActive ? 'text-primary' : 'opacity-70'} />
                      <span>{tManagerUi(tab.labelKey)}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'bg-surface text-secondary'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Action Controls: Export CSV */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
                  title="Export Filtered Students List as CSV"
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* ── Comprehensive Multi-Filter Bar ── */}
            <div className="flex flex-wrap items-center gap-2.5 mb-5 p-3 rounded-xl bg-surface/50 border border-border">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <label htmlFor="manager-members-search" className="sr-only">{tManagerUi('search_by_name_or_id')}</label>
                <input
                  id="manager-members-search"
                  type="search"
                  className="mgr-input pl-9 text-xs w-full"
                  placeholder={tManagerUi('search_by_name_or_id')}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                />
              </div>

              {/* Plan Filter */}
              <select
                aria-label="Filter by membership plan"
                value={planFilter}
                onChange={(e) => { setPlanFilter(e.target.value); setPage(0); }}
                className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
              >
                <option value="all">📦 All Plans</option>
                {MANAGER_MEMBERSHIP_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              {/* Shift Filter */}
              <select
                aria-label="Filter by shift"
                value={shiftFilter}
                onChange={(e) => { setShiftFilter(e.target.value); setPage(0); }}
                className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
              >
                <option value="all">⏰ All Shifts</option>
                <option value="Morning">Morning Shift</option>
                <option value="Afternoon">Afternoon Shift</option>
                <option value="Evening">Evening Shift</option>
                <option value="Full Day">Full Day</option>
              </select>

              {/* Gender Filter */}
              <select
                aria-label="Filter by gender"
                value={genderFilter}
                onChange={(e) => { setGenderFilter(e.target.value); setPage(0); }}
                className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
              >
                <option value="all">👥 All Genders</option>
                {MANAGER_MEMBERS_GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value}
                  </option>
                ))}
              </select>

              {/* Expiry Filter */}
              <select
                aria-label="Filter by validity expiration"
                value={expiryFilter}
                onChange={(e) => { setExpiryFilter(e.target.value); setPage(0); }}
                className="rounded-lg border border-border bg-card px-2.5 py-2 text-xs font-medium text-primary hover:border-primary focus:ring-1 focus:ring-primary shadow-xs cursor-pointer"
              >
                <option value="all">📅 All Expiry</option>
                <option value="7days">⚠️ Expiring in ≤ 7 Days</option>
                <option value="30days">🗓️ Expiring in ≤ 30 Days</option>
              </select>

              {/* Reset Filters CTA */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-bold text-danger hover:bg-danger-bg transition-colors cursor-pointer"
                  title="Clear all active filters"
                >
                  <X size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
            <div className="flex-1 w-full overflow-x-auto">
              {sortedMembers.length === 0 ? (
                  <ManagerMembersDirectoryEmptyState />
                ) : (
                  <>
                    <table className="mgr-table w-full">
                      <thead>
                        <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
                          {renderSortableHeader('id', tManagerUi('member_id_7a88b2'))}
                          {renderSortableHeader('name', tManagerUi('name'))}
                          {renderSortableHeader('phone', tManagerUi('phone'))}
                          {renderSortableHeader('type', tManagerUi('plan'))}
                          {renderSortableHeader('status', tManagerUi('status'))}
                          {renderSortableHeader('expiryDate', tManagerUi('expiry_date'))}
                          <th scope="col" className="px-3 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedMembers.map((member) => {
                          const badge = MANAGER_MEMBERS_STATUS_BADGES[member.status];
                          return (
                            <tr
                              key={member.id}
                              onClick={() => {
                                setProfileSearch(member.id);
                                setActiveTab('Member Profile');
                              }}
                              className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12 cursor-pointer transition-colors group"
                              title={`Click to view profile of ${member.name} (${member.id})`}
                            >
                              <td className="px-3 py-3 align-middle"><span className="font-mono text-primary font-semibold group-hover:underline">{member.id}</span></td>
                              <td className="px-3 py-3 align-middle font-bold text-primary group-hover:text-primary-hover">{member.name}</td>
                              <td className="px-3 py-3 align-middle">{maskManagerMemberPhone(member.phone)}</td>
                              <td className="px-3 py-3 align-middle"><span className="mgr-badge mgr-badge--info">{member.type}</span></td>
                              <td className="px-3 py-3 align-middle"><span className={`mgr-badge ${badge?.className ?? 'mgr-badge--neutral'}`}>{badge ? tManagerUi(badge.labelKey) : tManagerUi('status_unknown')}</span></td>
                              <td className="px-3 py-3 align-middle">{formatManagerMemberDirectoryCalendarDate(displayValue(member.expiryDate), locale)}</td>
                              <td className="px-3 py-3 align-middle text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileSearch(member.id);
                                    setActiveTab('Member Profile');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface border border-border text-primary hover:bg-primary hover:text-on-primary transition-colors"
                                  title={`View profile of ${member.name}`}
                                >
                                  <Eye size={13} aria-hidden="true" />
                                  <span>View Profile</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-3 py-3 text-sm text-secondary">
                      <span>
                        Showing {startItem}–{endItem} of {totalRows} results
                      </span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <label htmlFor="rows-per-page-members-directory" className="text-xs text-secondary whitespace-nowrap">
                            Rows per page:
                          </label>
                          <select
                            id="rows-per-page-members-directory"
                            value={pageSize}
                            onChange={(e) => {
                              setPageSize(Number(e.target.value));
                              setPage(0);
                            }}
                            className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="mgr-btn-ghost mgr-btn-sm"
                            disabled={effectivePage <= 0}
                            onClick={() => setPage((current) => Math.max(0, current - 1))}
                          >
                            Previous
                          </button>
                          <span className="text-xs text-secondary px-1">
                            Page {effectivePage + 1} of {pageCount}
                          </span>
                          <button
                            type="button"
                            className="mgr-btn-ghost mgr-btn-sm"
                            disabled={effectivePage >= pageCount - 1}
                            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
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
