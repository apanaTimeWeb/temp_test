'use client';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { ManagerMembersDirectoryEmptyState } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_states/ManagerMembersDirectoryEmptyState';
import { MANAGER_MEMBERS_STATUS_BADGES } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import ManagerMembersDirectoryFilterBar from './ManagerMembersDirectoryFilterBar';

export type MemberSortField = 'id' | 'name' | 'phone' | 'type' | 'status' | 'expiryDate';

interface ManagerMembersDirectoryTableProps {
  sortedMembers: ManagerMembersDirectoryRecord[];
  paginatedMembers: ManagerMembersDirectoryRecord[];
  totalRows: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  planFilter: string;
  setPlanFilter: (val: string) => void;
  shiftFilter: string;
  setShiftFilter: (val: string) => void;
  genderFilter: string;
  setGenderFilter: (val: string) => void;
  expiryFilter: string;
  setExpiryFilter: (val: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortField: MemberSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: MemberSortField) => void;
  onSelectMemberProfile: (memberId: string) => void;
  page: number;
  pageSize: number;
  pageCount: number;
  startItem: number;
  endItem: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerMembersDirectoryTable({
  sortedMembers,
  paginatedMembers,
  totalRows,
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  shiftFilter,
  setShiftFilter,
  genderFilter,
  setGenderFilter,
  expiryFilter,
  setExpiryFilter,
  hasActiveFilters,
  onResetFilters,
  sortField,
  sortDirection,
  onToggleSort,
  onSelectMemberProfile,
  page,
  pageSize,
  pageCount,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
}: ManagerMembersDirectoryTableProps) {
  const tManagerUi = useTranslations('manager.manager_member_directory.ui');
  const locale = useLocale();
  const effectivePage = Math.min(page, pageCount - 1);

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
          onClick={() => onToggleSort(field)}
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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      {/* ── Multi-Filter Bar ── */}
      <ManagerMembersDirectoryFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        shiftFilter={shiftFilter}
        setShiftFilter={setShiftFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        expiryFilter={expiryFilter}
        setExpiryFilter={setExpiryFilter}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />

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
                  <th scope="col" className="px-3 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => {
                  const badge = (MANAGER_MEMBERS_STATUS_BADGES as Record<string, { readonly className: string; readonly labelKey: string }>)[member.status];
                  return (
                    <tr
                      key={member.id}
                      onClick={() => onSelectMemberProfile(member.id)}
                      className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface h-12 cursor-pointer transition-colors group"
                      title={`Click to view profile of ${member.name} (${member.id})`}
                    >
                      <td className="px-3 py-3 align-middle">
                        <span className="font-mono text-primary font-semibold group-hover:underline">{member.id}</span>
                      </td>
                      <td className="px-3 py-3 align-middle font-bold text-primary group-hover:text-primary-hover">
                        {member.name}
                      </td>
                      <td className="px-3 py-3 align-middle">{maskManagerMemberPhone(member.phone)}</td>
                      <td className="px-3 py-3 align-middle">
                        <span className="mgr-badge mgr-badge--info">{member.type}</span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <span className={`mgr-badge ${badge?.className ?? 'mgr-badge--neutral'}`}>
                          {badge ? tManagerUi(badge.labelKey) : tManagerUi('status_unknown')}
                        </span>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        {formatManagerMemberDirectoryCalendarDate(displayValue(member.expiryDate), locale)}
                      </td>
                      <td className="px-3 py-3 align-middle text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectMemberProfile(member.id);
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
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
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
                    onClick={() => onPageChange(Math.max(0, effectivePage - 1))}
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
                    onClick={() => onPageChange(Math.min(pageCount - 1, effectivePage + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default ManagerMembersDirectoryTable;
