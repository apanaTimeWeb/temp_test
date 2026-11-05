'use client';
import { Search, Filter, X, Download } from 'lucide-react';
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
    <div className="flex flex-wrap gap-3 items-center justify-between bg-card p-3 rounded-xl border border-border">
      <div className="flex flex-wrap items-center gap-3 flex-grow max-w-xl">
        {/* Search Input */}
        <div className="relative flex-grow min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            className="w-full pl-9 pr-8 py-2 bg-muted border border-border rounded-lg text-sm text-primary outline-none focus:border-primary focus:bg-card motion-safe:transition-all"
            placeholder={tManagerUi('search_by_name_or_phone')}
            aria-label={tManagerUi('search_by_name_or_phone')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary p-0.5 rounded"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Filter size={14} className="text-secondary shrink-0" />
          <select
            className="min-h-10 py-1.5 px-3 bg-muted border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card motion-safe:transition-all cursor-pointer"
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
            <option value="All">{tManagerUi('all_statuses')}</option>
            {MANAGER_CRM_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:underline px-2 py-1"
          >
            Reset Filters
          </button>
        )}

        <span className="text-xs font-semibold text-secondary px-1 shrink-0">
          Showing {filteredCount} leads ({horizonLabel})
        </span>
      </div>

      {/* Export CSV Button */}
      <button
        type="button"
        onClick={onExportCsv}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
        title="Export CRM Enquiries as CSV"
      >
        <Download size={14} />
        <span>Export CSV</span>
      </button>
    </div>
  );
}

