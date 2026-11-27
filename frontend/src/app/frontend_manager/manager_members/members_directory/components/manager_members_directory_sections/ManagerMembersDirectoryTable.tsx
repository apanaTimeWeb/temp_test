'use client';

import ManagerMembersDirectoryFilterBar from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryFilterBar';
import { ManagerMembersDirectoryPhotoKycModal } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryPhotoKycModal';
import { ManagerMembersDirectoryTablePagination } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryTablePagination';
import { ManagerMembersDirectoryTableRow } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_sections/ManagerMembersDirectoryTableRow';
import { ManagerMembersDirectoryEmptyState } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_states/ManagerMembersDirectoryEmptyState';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { writeBrowserSessionStorageItem, writeBrowserStorageItem } from '@/lib/browserStorage';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

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
  onExportCsv?: () => void;
  onOpenBulkWhatsApp?: () => void;
  sortField: MemberSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: MemberSortField) => void;
  onSelectMemberProfile: (memberId: string) => void;
  selectedIds?: string[];
  onToggleSelectOne?: (id: string) => void;
  onToggleSelectAll?: () => void;
  onQuickWhatsApp?: (member: ManagerMembersDirectoryRecord) => void;
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
  onExportCsv,
  onOpenBulkWhatsApp,
  sortField,
  sortDirection,
  onToggleSort,
  onSelectMemberProfile,
  onQuickWhatsApp,
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
  const [previewMember, setPreviewMember] = useState<ManagerMembersDirectoryRecord | null>(null);

  const handleQuickCollectFee = (e: React.MouseEvent, m: ManagerMembersDirectoryRecord) => {
    e.stopPropagation();
    const prefillData = {
      memberId: m.id,
      memberName: m.name,
      phone: m.phone,
      seat: m.seat || '',
      shift: m.shift || '',
      plan: m.type || '',
      expiryDate: m.expiryDate || '',
    };
    try {
      const payload = JSON.stringify(prefillData);
      writeBrowserSessionStorageItem('manager_pending_fee_collection', payload);
      writeBrowserSessionStorageItem('enquiry_conversion_prefill', payload);
      writeBrowserStorageItem('manager_pending_fee_collection', payload);
    } catch {
      // storage unavailable
    }
    const q = `studentId=${encodeURIComponent(m.id)}&name=${encodeURIComponent(m.name)}&phone=${encodeURIComponent(m.phone)}&seat=${encodeURIComponent(m.seat || '')}&shift=${encodeURIComponent(m.shift || '')}&plan=${encodeURIComponent(m.type || '')}`;
    window.location.href = `/frontend_manager/manager_finance/finance_collect_fee?${q}`;
  };

  const renderSortableHeader = (field: MemberSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className="px-3 py-3">
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? <ArrowUp size={14} className="text-primary font-bold shrink-0" aria-hidden="true" /> : <ArrowDown size={14} className="text-primary font-bold shrink-0" aria-hidden="true" />
          ) : (
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 motion-safe:transition-opacity shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
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
        onExportCsv={onExportCsv}
        filteredCount={totalRows}
        onOpenBulkWhatsApp={onOpenBulkWhatsApp}
      />

      <div className="flex-1 w-full max-w-full min-w-0 overflow-x-auto" title="Collect Fee / Renew Plan">
        {sortedMembers.length === 0 ? (
          <ManagerMembersDirectoryEmptyState />
        ) : (
          <>
            <table className="mgr-table w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
                  {renderSortableHeader('id', tManagerUi('member_id_7a88b2'))}
                  {renderSortableHeader('name', tManagerUi('name'))}
                  {renderSortableHeader('phone', tManagerUi('phone'))}
                  {renderSortableHeader('type', tManagerUi('plan'))}
                  {renderSortableHeader('status', tManagerUi('status'))}
                  {renderSortableHeader('expiryDate', tManagerUi('expiry_date'))}
                  <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => (
                  <ManagerMembersDirectoryTableRow
                    key={member.id}
                    member={member}
                    locale={locale}
                    onSelectMemberProfile={onSelectMemberProfile}
                    onPreviewMember={setPreviewMember}
                    onQuickCollectFee={handleQuickCollectFee}
                    onQuickWhatsApp={onQuickWhatsApp}
                    tManagerUi={tManagerUi}
                  />
                ))}
              </tbody>
            </table>

            <ManagerMembersDirectoryTablePagination
              startItem={startItem}
              endItem={endItem}
              totalRows={totalRows}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
              effectivePage={effectivePage}
              pageCount={pageCount}
              onPageChange={onPageChange}
            />
          </>
        )}
      </div>

      <ManagerMembersDirectoryPhotoKycModal
        isOpen={Boolean(previewMember)}
        member={previewMember}
        onClose={() => setPreviewMember(null)}
        onViewFullProfile={onSelectMemberProfile}
        onQuickWhatsApp={onQuickWhatsApp}
      />
    </>
  );
}

export default ManagerMembersDirectoryTable;
