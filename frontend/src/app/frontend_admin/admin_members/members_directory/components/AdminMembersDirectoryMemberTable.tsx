'use client';
// RESPONSIBILITY: AdminMembersMemberTable component owned by admin_members.

import AdminMembersDirectoryMemberMobileCards from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberMobileCards';
import { AdminMembersDirectoryMemberTableToolbar } from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberTableToolbar';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import type { AdminMembersMemberTableProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';
import {
  downloadAdminMembersDemoCsv,
  downloadAdminMembersDemoExcel,
  formatAdminMembersDate,
  printAdminMembersRoster,
} from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';
import { displayValue } from '@/lib/display_value';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Mail, MessageSquare, RotateCcw } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

const STATUS_TRANSLATION_KEYS = {
  Active: 'STATUS_ACTIVE',
  Expired: 'STATUS_EXPIRED',
  Suspended: 'STATUS_SUSPENDED',
  Blocked: 'STATUS_BLOCKED',
} as const;

export default function AdminMembersMemberTable({
  members,
  filterStatus,
  onSelectMember,
  onAction,
  canMutate = true,
  selectedIds = [],
  onToggleSelectOne,
  onQuickWhatsApp,
}: AdminMembersMemberTableProps) {
  const t = useTranslations('ADMIN_MEMBERS');
  const locale = useLocale();
  type MemberSortField = 'name' | 'phone' | 'plan' | 'seat' | 'expiryDate' | 'status';
  const [sortField, setSortField] = useState<MemberSortField | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useAdminApplicationInfrastructureUrlQueryState<number>('page', 0);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [feeFilter, setFeeFilter] = useState<'all' | 'Paid' | 'Due'>('all');
  const [shiftFilter, setShiftFilter] = useState<string>('all');

  const availablePlans = useMemo(() => Array.from(new Set(members.map((m) => m.plan).filter(Boolean))), [members]);
  const availableShifts = useMemo(() => Array.from(new Set(members.map((m) => m.shift).filter((s): s is string => Boolean(s)))), [members]);

  const toggleSort = (field: MemberSortField) => {
    setPage(0);
    if (sortField === field) setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filteredMembers = useMemo(
    () => members.filter((member) => !filterStatus || member.status === filterStatus),
    [filterStatus, members],
  );

  const searchedMembers = useMemo(() => {
    let result = filteredMembers;
    if (planFilter !== 'all') result = result.filter((m) => m.plan.toLowerCase().includes(planFilter.toLowerCase()));
    if (feeFilter !== 'all') result = result.filter((m) => m.feeStatus === feeFilter);
    if (shiftFilter !== 'all') result = result.filter((m) => (m.shift || '').toLowerCase() === shiftFilter.toLowerCase());
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          Boolean(m.email && m.email.toLowerCase().includes(q)) ||
          Boolean(m.phone && m.phone.toLowerCase().includes(q)) ||
          Boolean(m.seat && m.seat.toLowerCase().includes(q)) ||
          Boolean(m.shift && m.shift.toLowerCase().includes(q)) ||
          Boolean(m.locker && m.locker.toLowerCase().includes(q)) ||
          Boolean(m.branch && m.branch.toLowerCase().includes(q)) ||
          m.plan.toLowerCase().includes(q),
      );
    }
    return result;
  }, [filteredMembers, planFilter, feeFilter, shiftFilter, searchQuery]);

  const sortedMembers = useMemo(() => {
    if (!sortField) return searchedMembers;
    return [...searchedMembers].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const cmp = aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }
      return 0;
    });
  }, [searchedMembers, sortField, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedMembers.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const visibleMembers = sortedMembers.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const statusLabel = (status: AdminMembersMember['status']) => t(STATUS_TRANSLATION_KEYS[status] ?? 'STATUS_UNKNOWN');
  const expiryLabel = (date: string) => formatAdminMembersDate(date, locale, t('UNKNOWN_DATE'));

  const renderSortableHeader = (field: MemberSortField, label: string, extraClass = '') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-4 py-3 whitespace-nowrap ${extraClass}`}>
        <button type="button" onClick={() => toggleSort(field)} className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1" aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}>
          <span>{label}</span>
          {isActive ? (sortDirection === 'asc' ? <ArrowUp className="text-primary font-bold shrink-0" size={14} aria-hidden="true" /> : <ArrowDown className="text-primary font-bold shrink-0" size={14} aria-hidden="true" />) : <ArrowUpDown className="text-text-secondary opacity-60 group-hover:opacity-100 group-hover:text-primary motion-safe:transition-opacity shrink-0" size={14} aria-hidden="true" />}
        </button>
      </th>
    );
  };

  const getStatusBadge = (status: AdminMembersMember['status']) => {
    switch (status) {
      case 'Active': return 'border border-success bg-success-bg text-success-text';
      case 'Expired': return 'border border-danger bg-danger-bg text-danger-text';
      case 'Suspended': return 'border border-warning bg-warning-bg text-warning-text';
      case 'Blocked': return 'border border-danger bg-danger-bg text-danger-text';
      default: return 'border border-border bg-surface-highlight text-text-secondary';
    }
  };

  if (filteredMembers.length === 0) {
    return <div className="p-8 text-center text-text-secondary" role="status">{t('TABLE_EMPTY')}</div>;
  }

  const handleExportCsv = () => {
    if (searchedMembers.length === 0) { toast.info('No members available to export.', { id: 'admin-members-table-export-empty' }); return; }
    downloadAdminMembersDemoCsv(searchedMembers, 'smart-library-members.csv');
    toast.success(`Exported ${searchedMembers.length} member(s) to CSV`, { id: 'admin-members-table-export-csv' });
  };
  const handleExportExcel = () => {
    if (searchedMembers.length === 0) { toast.info('No members available to export.', { id: 'admin-members-table-export-empty' }); return; }
    downloadAdminMembersDemoExcel(searchedMembers, 'smart-library-members.xls');
    toast.success(`Exported ${searchedMembers.length} member(s) to Excel (.xls)`, { id: 'admin-members-table-export-excel' });
  };
  const handlePrint = () => {
    if (searchedMembers.length === 0) { toast.info('No members available to print.', { id: 'admin-members-table-print-empty' }); return; }
    printAdminMembersRoster(searchedMembers, 'Member Directory Roster');
    toast.success(`Prepared ${searchedMembers.length} member(s) for printing`, { id: 'admin-members-table-print-ok' });
  };

  const resetAllFilters = () => { setSearchQuery(''); setPlanFilter('all'); setShiftFilter('all'); setFeeFilter('all'); setPage(0); };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <AdminMembersDirectoryMemberTableToolbar
        searchQuery={searchQuery}
        onSearchChange={(q) => { setSearchQuery(q); setPage(0); }}
        planFilter={planFilter}
        onPlanFilterChange={(p) => { setPlanFilter(p); setPage(0); }}
        availablePlans={availablePlans}
        shiftFilter={shiftFilter}
        onShiftFilterChange={(s) => { setShiftFilter(s); setPage(0); }}
        availableShifts={availableShifts}
        feeFilter={feeFilter}
        onFeeFilterChange={(f) => { setFeeFilter(f); setPage(0); }}
        isFilterActive={Boolean(searchQuery || planFilter !== 'all' || feeFilter !== 'all' || shiftFilter !== 'all')}
        onResetFilters={resetAllFilters}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onPrint={handlePrint}
        matchedCount={searchedMembers.length}
        totalCount={filteredMembers.length}
      />

      {searchedMembers.length === 0 ? (
        <div className="p-8 text-center text-text-secondary space-y-3" role="status">
          <p className="text-sm text-text-primary">No members found matching your search or filters.</p>
          <button type="button" onClick={resetAllFilters} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-highlight px-3.5 py-1.5 text-xs font-semibold text-text-primary hover:bg-surface-hover motion-safe:transition-colors">
            <RotateCcw size={12} className="text-danger-text" aria-hidden="true" /> Clear Search & Filters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-highlight uppercase text-[11px] font-semibold text-text-secondary border-b border-border tracking-wider">
                <tr>
                  {renderSortableHeader('name', t('TABLE_MEMBER'))}
                  {renderSortableHeader('phone', t('TABLE_CONTACT'))}
                  {renderSortableHeader('plan', t('TABLE_PLAN'))}
                  {renderSortableHeader('seat', 'Seat')}
                  {renderSortableHeader('expiryDate', t('TABLE_EXPIRY'))}
                  {renderSortableHeader('status', t('TABLE_STATUS'))}
                  <th scope="col" className="px-4 py-3 text-right">{t('TABLE_ACTIONS')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-surface-hover motion-safe:transition-colors h-14">
                    <th scope="row" className="px-4 py-3 font-medium text-text-primary">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl border border-border-focus bg-primary-subtle flex items-center justify-center shrink-0 font-bold text-xs text-primary">
                          {member.name.trim().slice(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <div>
                          <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold text-text-primary hover:text-primary motion-safe:transition-colors text-left block" onClick={() => onSelectMember(member)}>
                            {displayValue(member.name)}
                          </button>
                          <span className="block text-xs font-mono text-text-secondary">{displayValue(member.id)}</span>
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-3 text-text-primary text-xs font-mono">{displayValue(member.email || member.phone)}</td>
                    <td className="px-4 py-3 text-text-primary font-medium">{displayValue(member.plan)}</td>
                    <td className="px-4 py-3 text-text-primary font-medium">{member.seat ? `Seat ${member.seat}` : '—'}</td>
                    <td className="px-4 py-3 text-text-secondary">{expiryLabel(member.expiryDate)}</td>
                    <td className="px-4 py-3"><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(member.status)}`}>{statusLabel(member.status)}</span></td>
                    <td className="px-4 py-3">
                      <div className="relative flex justify-end gap-1.5">
                        {member.email && (
                          <a href={`mailto:${member.email}?subject=${encodeURIComponent('Smart Library Notice')}&body=${encodeURIComponent(`Dear ${member.name},\n\n`)}`} className="min-h-9 min-w-9 rounded-lg border border-border bg-purple-bg text-purple hover:opacity-90 inline-flex items-center justify-center motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" title={`Email ${member.name}`} aria-label={`Email ${member.name}`}>
                            <Mail size={15} strokeWidth={2} aria-hidden="true" />
                          </a>
                        )}
                        <button type="button" className="min-h-9 min-w-9 rounded-lg border border-info bg-info-bg text-info-text hover:opacity-90 inline-flex items-center justify-center motion-safe:transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('ACTION_VIEW_MEMBER', { name: member.name })} title="View member details" onClick={() => onSelectMember(member)}>
                          <Eye size={17} strokeWidth={2} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="min-h-9 min-w-9 rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex items-center justify-center motion-safe:transition-opacity"
                          title="Chat on WhatsApp"
                          aria-label={`Chat with ${member.name} on WhatsApp`}
                          onClick={() => {
                            if (onQuickWhatsApp) onQuickWhatsApp(member);
                            else {
                              const digits = (member.phone || '').replace(/\D/g, '');
                              const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
                              const phone = clean.length === 10 ? `91${clean}` : clean;
                              const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
                              if (popup) popup.opener = null;
                            }
                          }}
                        >
                          <MessageSquare size={17} strokeWidth={2} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminMembersDirectoryMemberMobileCards visibleMembers={visibleMembers} selectedIds={selectedIds} onToggleSelectOne={onToggleSelectOne} onSelectMember={onSelectMember} onAction={onAction} canMutate={canMutate} statusLabel={statusLabel} expiryLabel={expiryLabel} />
        </>
      )}

      {filteredMembers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-text-secondary bg-surface-highlight">
          <span>{t('PAGINATION_SHOWING_RANGE', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, sortedMembers.length), total: sortedMembers.length })}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-members-directory" className="text-xs text-text-secondary whitespace-nowrap">Rows per page:</label>
              <select id="rows-per-page-members-directory" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }} className="rounded-lg border border-border bg-input px-2.5 py-1 text-xs text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="inline-flex items-center min-h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-colors" disabled={currentPage === 0} onClick={() => setPage((current) => Math.max(0, current - 1))}>
                <ChevronLeft size={14} className="mr-1 text-text-secondary" aria-hidden="true" /> {t('PAGINATION_PREVIOUS')}
              </button>
              <span className="text-xs text-text-secondary">Page {currentPage + 1} of {pageCount}</span>
              <button type="button" className="inline-flex items-center min-h-8 rounded-lg border border-border bg-card px-3 py-1 text-xs font-medium text-text-primary hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-40 motion-safe:transition-colors" disabled={currentPage >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}>
                {t('PAGINATION_NEXT')} <ChevronRight size={14} className="ml-1 text-text-secondary" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { AdminMembersMemberTableProps };
