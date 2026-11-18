'use client';
// RESPONSIBILITY: AdminMembersMemberTable component owned by admin_members; responsibility folder: admin_members_components_tables.
import { useAdminApplicationInfrastructureUrlQueryState } from '@/app/frontend_admin/application_infrastructure/application_infrastructure_hooks/useAdminApplicationInfrastructureUrlQueryState';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Eye, ArrowUpDown, ArrowUp, ArrowDown, MessageSquare, Search, Filter, RotateCcw, X, ChevronLeft, ChevronRight, IndianRupee, Clock, DownloadCloud, FileSpreadsheet, Printer, PhoneCall } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { formatAdminMembersDate, downloadAdminMembersDemoCsv, downloadAdminMembersDemoExcel, printAdminMembersRoster } from '@/app/frontend_admin/admin_members/members_directory/utils/AdminMembersDirectoryExportUtils';
import { displayValue } from '@/lib/display_value';
import AdminMembersDirectoryMemberMobileCards from '@/app/frontend_admin/admin_members/members_directory/components/AdminMembersDirectoryMemberMobileCards';
import type { AdminMembersMemberTableProps } from '@/app/frontend_admin/admin_members/members_directory/types/AdminMembersDirectoryComponentTypes';


const STATUS_TRANSLATION_KEYS = {
  Active: 'STATUS_ACTIVE',
  Expired: 'STATUS_EXPIRED',
  Suspended: 'STATUS_SUSPENDED',
  Blocked: 'STATUS_BLOCKED',
} as const;

/** Feature-owned table; no backend records are synthesized here. */
export default function AdminMembersMemberTable({
  members,
  filterStatus,
  onSelectMember,
  onAction,
  canMutate = true,
  selectedIds = [],
  onToggleSelectOne,
  onToggleSelectAll,
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

  const availablePlans = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.plan) set.add(m.plan);
    });
    return Array.from(set);
  }, [members]);

  const availableShifts = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => {
      if (m.shift) set.add(m.shift);
    });
    return Array.from(set);
  }, [members]);

  const toggleSort = (field: MemberSortField) => {
    setPage(0);
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredMembers = useMemo(
    () => members.filter((member) => !filterStatus || member.status === filterStatus),
    [filterStatus, members],
  );

  const searchedMembers = useMemo(() => {
    let result = filteredMembers;
    if (planFilter !== 'all') {
      result = result.filter((m) => m.plan.toLowerCase().includes(planFilter.toLowerCase()));
    }
    if (feeFilter !== 'all') {
      result = result.filter((m) => m.feeStatus === feeFilter);
    }
    if (shiftFilter !== 'all') {
      result = result.filter((m) => (m.shift || '').toLowerCase() === shiftFilter.toLowerCase());
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q)) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        (m.seat && m.seat.toLowerCase().includes(q)) ||
        (m.shift && m.shift.toLowerCase().includes(q)) ||
        (m.locker && m.locker.toLowerCase().includes(q)) ||
        (m.branch && m.branch.toLowerCase().includes(q)) ||
        m.plan.toLowerCase().includes(q)
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

  const renderSortableHeader = (field: MemberSortField, label: string, extraClass: string = '') => {
    const isActive = sortField === field;
    return (
      <th scope="col" aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined} className={`px-4 py-3 whitespace-nowrap ${extraClass}`}>
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1"
          aria-label={`${label}, sort ${isActive ? (sortDirection === 'asc' ? 'descending' : 'ascending') : 'ascending'}`}
        >
          <span>{label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            ) : (
              <ArrowDown className="text-indigo-400 font-bold shrink-0" size={14} aria-hidden="true" />
            )
          ) : (
            <ArrowUpDown className="text-slate-500 opacity-60 group-hover:opacity-100 group-hover:text-indigo-400 transition-colors shrink-0" size={14} aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  const getStatusBadge = (status: AdminMembersMember['status']) => {
    switch (status) {
      case 'Active':
        return 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'Expired':
        return 'border border-rose-500/30 bg-rose-500/10 text-rose-400';
      case 'Suspended':
        return 'border border-amber-500/30 bg-amber-500/10 text-amber-400';
      case 'Blocked':
        return 'border border-red-500/30 bg-red-500/10 text-red-400';
      default:
        return 'border border-slate-700 bg-slate-800 text-slate-300';
    }
  };

  if (filteredMembers.length === 0) {
    return <div className="p-8 text-center text-slate-400" role="status">{t('TABLE_EMPTY')}</div>;
  }

  const handleExportCsv = () => {
    if (searchedMembers.length === 0) {
      toast.info('No members available to export.');
      return;
    }
    downloadAdminMembersDemoCsv(searchedMembers, 'smart-library-members.csv');
    toast.success(`Exported ${searchedMembers.length} member(s) to CSV`);
  };

  const handleExportExcel = () => {
    if (searchedMembers.length === 0) {
      toast.info('No members available to export.');
      return;
    }
    downloadAdminMembersDemoExcel(searchedMembers, 'smart-library-members.xls');
    toast.success(`Exported ${searchedMembers.length} member(s) to Excel (.xls)`);
  };

  const handlePrint = () => {
    if (searchedMembers.length === 0) {
      toast.info('No members available to print.');
      return;
    }
    printAdminMembersRoster(searchedMembers, 'Member Directory Roster');
    toast.success(`Prepared ${searchedMembers.length} member(s) for printing`);
  };

  const isFilterActive = Boolean(
    searchQuery || planFilter !== 'all' || feeFilter !== 'all' || shiftFilter !== 'all'
  );

  const resetAllFilters = () => {
    setSearchQuery('');
    setPlanFilter('all');
    setShiftFilter('all');
    setFeeFilter('all');
    setPage(0);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/30 shadow-xl">
      {/* SEARCH, FILTER & EXPORT TOOLBAR */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search member by name, ID, phone, email, seat, plan..."
              className="w-full rounded-xl border border-slate-700/60 bg-slate-950/70 pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPage(0);
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={14} className="text-rose-400" />
              </button>
            )}
          </div>

          {/* EXPORT / PRINT BUTTONS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              title="Download filtered members as CSV"
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-2 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition-all shadow-sm"
            >
              <DownloadCloud size={14} className="text-teal-400 shrink-0" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              title="Download filtered members as Excel (.xls)"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
            >
              <FileSpreadsheet size={14} className="text-emerald-400 shrink-0" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              title="Print member directory roster"
              className="inline-flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 transition-all shadow-sm"
            >
              <Printer size={14} className="text-sky-400 shrink-0" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* FILTERS & STATS ROW */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/40">
          <div className="flex flex-wrap items-center gap-2">
            {/* Plan filter */}
            <div className="relative flex items-center">
              <Filter size={13} className="absolute left-2.5 text-purple-400 pointer-events-none" />
              <select
                value={planFilter}
                onChange={(e) => {
                  setPlanFilter(e.target.value);
                  setPage(0);
                }}
                aria-label="Filter by plan"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="all">All Plans</option>
                {availablePlans.map((plan) => (
                  <option key={plan} value={plan}>{plan}</option>
                ))}
              </select>
            </div>

            {/* Shift filter */}
            {availableShifts.length > 0 && (
              <div className="relative flex items-center">
                <Clock size={13} className="absolute left-2.5 text-teal-400 pointer-events-none" />
                <select
                  value={shiftFilter}
                  onChange={(e) => {
                    setShiftFilter(e.target.value);
                    setPage(0);
                  }}
                  aria-label="Filter by shift"
                  className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Shifts</option>
                  {availableShifts.map((shift) => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Fee Status filter */}
            <div className="relative flex items-center">
              <IndianRupee size={13} className="absolute left-2.5 text-emerald-400 pointer-events-none" />
              <select
                value={feeFilter}
                onChange={(e) => {
                  setFeeFilter(e.target.value as 'all' | 'Paid' | 'Due');
                  setPage(0);
                }}
                aria-label="Filter by fee status"
                className="rounded-xl border border-slate-700/60 bg-slate-950/70 pl-7 pr-3 py-1.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="all">All Fees</option>
                <option value="Paid">Paid</option>
                <option value="Due">Due Fee</option>
              </select>
            </div>

            {/* Reset button */}
            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
              >
                <RotateCcw size={12} className="text-rose-400" /> Reset
              </button>
            )}
          </div>

          <span className="text-[11px] font-medium text-slate-400 shrink-0">
            {searchedMembers.length} of {filteredMembers.length} records
          </span>
        </div>
      </div>

      {searchedMembers.length === 0 ? (
        <div className="p-8 text-center text-slate-400 space-y-3" role="status">
          <p className="text-sm text-slate-300">No members found matching your search or filters.</p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={12} className="text-rose-400" /> Clear Search & Filters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 uppercase text-[11px] font-semibold text-slate-400 border-b border-slate-800/80 tracking-wider">
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
              <tbody className="divide-y divide-slate-800/50">
                {visibleMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-indigo-500/5 transition-colors h-14">
                    <th scope="row" className="px-4 py-3 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center shrink-0 font-bold text-xs text-indigo-300">
                          {member.name.trim().slice(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <div>
                          <button type="button" className="underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 font-semibold text-white hover:text-indigo-300 transition-colors text-left block" onClick={() => onSelectMember(member)}>{displayValue(member.name)}</button>
                          <span className="block text-xs font-mono text-slate-400">{displayValue(member.id)}</span>
                        </div>
                      </div>
                    </th>
                      <td className="px-4 py-3 text-slate-200 text-xs font-mono">{displayValue(member.email || member.phone)}</td>
                      <td className="px-4 py-3 text-slate-200 font-medium">{displayValue(member.plan)}</td>
                      <td className="px-4 py-3 text-slate-200 font-medium">{member.seat ? `Seat ${member.seat}` : '—'}</td>
                      <td className="px-4 py-3 text-slate-300">{expiryLabel(member.expiryDate)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(member.status)}`}>{statusLabel(member.status)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative flex justify-end gap-1.5">
                          {member.phone && (
                            <a
                              href={`tel:${member.phone.replace(/\D/g, '')}`}
                              className="min-h-9 min-w-9 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                              title={`Call ${member.name}`}
                              aria-label={`Call ${member.name}`}
                            >
                              <PhoneCall size={15} strokeWidth={2} className="text-amber-400" aria-hidden="true" />
                            </a>
                          )}
                          <button
                            type="button"
                            className="min-h-9 min-w-9 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:text-sky-300 hover:bg-sky-500/20 inline-flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                            aria-label={t('ACTION_VIEW_MEMBER', { name: member.name })}
                            title="View member details"
                            onClick={() => onSelectMember(member)}
                          >
                            <Eye size={17} strokeWidth={2} className="text-sky-400" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="min-h-9 min-w-9 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 inline-flex items-center justify-center transition-all"
                            title="Chat on WhatsApp"
                            aria-label={`Chat with ${member.name} on WhatsApp`}
                            onClick={() => {
                              if (onQuickWhatsApp) {
                                onQuickWhatsApp(member);
                              } else {
                                const digits = (member.phone || '').replace(/\D/g, '');
                                const clean = digits.length === 11 && digits.startsWith('0') ? digits.slice(1) : digits;
                                const phone = clean.length === 10 ? `91${clean}` : clean;
                                const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Hello ${member.name}, greetings from Smart Library admin!`)}`, '_blank', 'noopener,noreferrer');
                                if (popup) {
                                  popup.opener = null;
                                }
                              }
                            }}
                          >
                            <MessageSquare size={17} strokeWidth={2} className="text-emerald-400" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AdminMembersDirectoryMemberMobileCards
            visibleMembers={visibleMembers}
            selectedIds={selectedIds}
            onToggleSelectOne={onToggleSelectOne}
            onSelectMember={onSelectMember}
            onAction={onAction}
            canMutate={canMutate}
            statusLabel={statusLabel}
            expiryLabel={expiryLabel}
          />
        </>
      )}

      {filteredMembers.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 px-4 py-3 text-xs text-slate-400 bg-slate-900/30">
          <span>{t('PAGINATION_SHOWING_RANGE', { start: currentPage * pageSize + 1, end: Math.min((currentPage + 1) * pageSize, sortedMembers.length), total: sortedMembers.length })}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-members-directory" className="text-xs text-slate-400 whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-members-directory"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center min-h-8 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                disabled={currentPage === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
              >
                <ChevronLeft size={14} className="mr-1 text-slate-400" />
                {t('PAGINATION_PREVIOUS')}
              </button>
              <span className="text-xs text-slate-400">
                Page {currentPage + 1} of {pageCount}
              </span>
              <button
                type="button"
                className="inline-flex items-center min-h-8 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                disabled={currentPage >= pageCount - 1}
                onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
              >
                {t('PAGINATION_NEXT')}
                <ChevronRight size={14} className="ml-1 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export type { AdminMembersMemberTableProps };
