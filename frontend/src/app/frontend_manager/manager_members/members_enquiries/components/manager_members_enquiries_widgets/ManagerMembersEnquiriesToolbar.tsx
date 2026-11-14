'use client';
import { Search, Filter, X, Download, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MANAGER_CRM_STATUS_OPTIONS } from '@/app/frontend_manager/manager_members/members_enquiries/constants/ManagerMembersEnquiriesConstants';
import type { ManagerMembersEnquiriesEnquiryStatus } from '@/app/frontend_manager/manager_members/members_enquiries/types/ManagerMembersEnquiriesTypes';

interface ManagerMembersEnquiriesToolbarProps {
  search: string;
  setSearch: (val: string) => void;
  statusFilter: 'All' | ManagerMembersEnquiriesEnquiryStatus;
  setStatusFilter: (val: 'All' | ManagerMembersEnquiriesEnquiryStatus) => void;
  statusLabels: Record<string, string>;
  filteredCount: number;
  horizonLabel: string;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
}

export function ManagerMembersEnquiriesToolbar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  statusLabels,
  filteredCount,
  horizonLabel,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
}: ManagerMembersEnquiriesToolbarProps) {
  const tManagerUi = useTranslations('manager.manager_enquiries.ui');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-[#0c0f28]/95 border border-indigo-500/25 backdrop-blur-md shadow-lg shadow-black/30 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0 w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0 w-full sm:min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none z-10" />
          <input
            type="text"
            className="w-full !pl-10 pr-8 py-2 bg-[#060818] border border-indigo-500/25 rounded-xl text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
            style={{ paddingLeft: '2.5rem' }}
            placeholder={tManagerUi('search_by_name_or_phone')}
            aria-label={tManagerUi('search_by_name_or_phone')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors cursor-pointer"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter & Showing Count */}
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
            <Filter size={14} className="text-indigo-400 shrink-0" />
            <select
              className="w-full sm:w-auto min-h-10 py-1.5 px-3 bg-[#060818] border border-indigo-500/25 rounded-xl text-xs font-semibold text-slate-200 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all cursor-pointer"
              aria-label={tManagerUi('status')}
              value={statusFilter}
              onChange={(event) => {
                const nextStatus = event.currentTarget.value;
                if (
                  nextStatus === 'All' ||
                  MANAGER_CRM_STATUS_OPTIONS.includes(nextStatus as (typeof MANAGER_CRM_STATUS_OPTIONS)[number])
                ) {
                  setStatusFilter(nextStatus as 'All' | ManagerMembersEnquiriesEnquiryStatus);
                }
              }}
            >
              <option value="All" className="bg-[#0b0c20] text-slate-200">{tManagerUi('all_statuses')}</option>
              {MANAGER_CRM_STATUS_OPTIONS.map((status) => (
                <option key={status} value={status} className="bg-[#0b0c20] text-slate-200">
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline px-2 py-1 transition-colors shrink-0 cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 shrink-0 whitespace-nowrap">
            <Users size={12} className="text-indigo-400" />
            Showing {filteredCount} leads ({horizonLabel})
          </span>
        </div>
      </div>

      {/* Export CSV Button */}
      <button
        type="button"
        onClick={onExportCsv}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-bold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 motion-safe:transition-all shadow-sm shrink-0 cursor-pointer w-full md:w-auto"
        title="Export CRM Enquiries as CSV"
      >
        <Download size={14} className="text-indigo-400" />
        <span>Export CSV</span>
      </button>
    </div>
  );
}
