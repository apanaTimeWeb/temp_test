'use client';
import { ManagerMembersDirectoryEmptyState } from '@/app/frontend_manager/manager_members/members_directory/components/manager_members_directory_states/ManagerMembersDirectoryEmptyState';
import { MANAGER_MEMBERS_STATUS_BADGES } from '@/app/frontend_manager/manager_members/members_directory/constants/ManagerMembersDirectoryConstants';
import type { ManagerMembersDirectoryRecord } from '@/app/frontend_manager/manager_members/members_directory/types/ManagerMembersDirectoryTypes';
import { formatManagerMemberDirectoryCalendarDate } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDateFormatting';
import { displayValue } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryDisplayValue';
import { maskManagerMemberPhone } from '@/app/frontend_manager/manager_members/members_directory/utils/ManagerMembersDirectoryPrivacy';
import { ArrowDown,ArrowUp,ArrowUpDown,Eye,IndianRupee,MessageCircle,ShieldCheck } from 'lucide-react';
import { useLocale,useTranslations } from 'next-intl';
import { useState } from 'react';
import ManagerMembersDirectoryFilterBar from './ManagerMembersDirectoryFilterBar';
import { ManagerMembersDirectoryPhotoKycModal } from './ManagerMembersDirectoryPhotoKycModal';
import { ManagerMembersDirectoryTablePagination } from './ManagerMembersDirectoryTablePagination';

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
  selectedIds = [],
  onToggleSelectOne,
  onToggleSelectAll,
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
      sessionStorage.setItem('manager_pending_fee_collection', JSON.stringify(prefillData));
      sessionStorage.setItem('enquiry_conversion_prefill', JSON.stringify(prefillData));
      localStorage.setItem('manager_pending_fee_collection', JSON.stringify(prefillData));
    } catch (_) {}
    window.location.href = `/frontend_manager/manager_finance/finance_collect_fee?studentId=${encodeURIComponent(m.id)}&name=${encodeURIComponent(m.name)}&phone=${encodeURIComponent(m.phone)}&seat=${encodeURIComponent(m.seat || '')}&shift=${encodeURIComponent(m.shift || '')}&plan=${encodeURIComponent(m.type || '')}`;
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
        onExportCsv={onExportCsv}
        filteredCount={totalRows}
        onOpenBulkWhatsApp={onOpenBulkWhatsApp}
      />

      <div className="flex-1 w-full max-w-full min-w-0 overflow-x-auto">
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
                  <th scope="col" className="px-3 py-3 text-right whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member) => {
                  const badge = (MANAGER_MEMBERS_STATUS_BADGES as Record<string, { readonly className: string; readonly labelKey: string }>)[member.status];
                  const isChecked = selectedIds.includes(member.id);
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
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewMember(member);
                            }}
                            className="w-8 h-8 rounded-full border border-primary bg-surface-zebra flex items-center justify-center shrink-0 overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all text-xs font-bold text-primary"
                            title={`Preview Photo & KYC of ${member.name}`}
                          >
                            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </button>
                          <div>
                            <span className="block leading-tight">{member.name}</span>
                            <span className="text-[11px] text-secondary font-normal block">
                              {member.seat ? `Seat ${member.seat}` : 'General'} · {member.shift || 'Morning'}
                            </span>
                          </div>
                        </div>
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
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Quick Collect Fee Button (Emerald) */}
                          <button
                            type="button"
                            onClick={(e) => handleQuickCollectFee(e, member)}
                            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
                            title={`Collect Fee / Renew Plan for ${member.name}`}
                            aria-label={`Collect Fee for ${member.name}`}
                          >
                            <IndianRupee size={13} />
                            <span className="hidden lg:inline text-xs font-semibold ml-1">Fee</span>
                          </button>

                          

                          {/* WhatsApp Button (Emerald) */}
                          {onQuickWhatsApp && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onQuickWhatsApp(member); }}
                              aria-label={`Send WhatsApp message to ${member.name}`}
                              className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/35 hover:text-emerald-200 transition-all cursor-pointer shadow-sm shadow-emerald-950/50"
                              title={`Send WhatsApp to ${member.name}`}
                            >
                              <MessageCircle size={13} />
                              <span className="hidden sm:inline text-xs font-semibold ml-1">WhatsApp</span>
                            </button>
                          )}

                          {/* Photo & KYC Button (Purple) */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreviewMember(member); }}
                            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40 hover:bg-purple-500/35 hover:text-purple-200 transition-all cursor-pointer shadow-sm shadow-purple-950/50"
                            title={`Preview Photo & KYC for ${member.name}`}
                          >
                            <ShieldCheck size={13} />
                            <span className="hidden md:inline text-xs font-semibold ml-1">KYC</span>
                          </button>

                          {/* View Profile Button (Sky Blue) */}
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onSelectMemberProfile(member.id); }}
                            className="inline-flex items-center justify-center min-h-8 min-w-8 px-2.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 hover:bg-sky-500/35 hover:text-sky-200 transition-all cursor-pointer shadow-sm shadow-sky-950/50"
                            title={`View profile of ${member.name}`}
                          >
                            <Eye size={13} />
                            <span className="text-xs font-semibold ml-1">View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

      {/* Student Photo & KYC Lightbox Preview Modal */}
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
