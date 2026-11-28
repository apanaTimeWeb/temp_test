'use client';
import { ManagerMembersReferralBonusTableRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/components/manager_members_referral_bonus_views/ManagerMembersReferralBonusTableRowAndDeleteModal';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Download, Gift, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export type ReferralSortField = 'id' | 'referrer' | 'referred' | 'date' | 'bonus' | 'method' | 'status';

export interface ManagerMembersReferralBonusTableProps {
  filteredRows: ReferralRow[];
  paginatedRows: ReferralRow[];
  totalRows: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: 'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal';
  setStatusFilter: (val: 'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal') => void;
  methodFilter: 'All' | 'Fee Discount' | 'UPI Cash';
  setMethodFilter: (val: 'All' | 'Fee Discount' | 'UPI Cash') => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortField: ReferralSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: ReferralSortField) => void;
  onApprove: (id: string) => void;
  onApplyToRenewal: (referral: ReferralRow) => void;
  onDeleteReferral?: (id: string) => void;
  onExportCsv: () => void;
  page: number;
  pageSize: number;
  pageCount: number;
  startItem: number;
  endItem: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

export function ManagerMembersReferralBonusTable({
  filteredRows,
  paginatedRows,
  totalRows,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  hasActiveFilters,
  onResetFilters,
  sortField,
  sortDirection,
  onToggleSort,
  onApprove,
  onApplyToRenewal,
  onDeleteReferral,
  onExportCsv,
  page,
  pageSize,
  pageCount,
  startItem,
  endItem,
  onPageChange,
  onPageSizeChange,
}: ManagerMembersReferralBonusTableProps) {
  const tManagerUi = useTranslations('manager.manager_referral_bonus.ui');
  const effectivePage = Math.min(page, pageCount - 1);

  const renderSortableHeader = (field: ReferralSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="py-3 px-4 text-left align-middle whitespace-nowrap"
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
            <ArrowUpDown size={14} className="text-secondary group-hover:text-primary motion-safe:transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      {/* Filter and Search Bar - Consistent 36px (h-9) heights and colorful icons */}
      <div className="mgr-card p-3 sm:p-4 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-1">
            {/* Search Box - zero overlap with !pl-10 and vibrant primary icon */}
            <div className="mgr-input-icon-wrap relative flex-1 min-w-[200px] max-w-sm">
              <Search size={16} className="mgr-input-icon absolute left-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
              <input
                type="search"
                maxLength={80}
                placeholder="Search by referrer, referred student, or Ref ID..."
                className="mgr-input mgr-input-with-icon !pl-10 text-xs w-full h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.slice(0, 80))}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-danger hover:opacity-80 rounded-full motion-safe:transition-colors"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} className="shrink-0 text-danger" />
                </button>
              )}
            </div>

            <div className="w-full sm:w-44">
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Credited' | 'Pending' | 'Adjusted in Renewal')}
                className="mgr-select text-xs w-full h-9"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Approval</option>
                <option value="Credited">Credited</option>
                <option value="Adjusted in Renewal">Adjusted in Renewal</option>
              </select>
            </div>

            <div className="w-full sm:w-40">
              <select
                aria-label="Filter by Reward Method"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as 'All' | 'Fee Discount' | 'UPI Cash')}
                className="mgr-select text-xs w-full h-9"
              >
                <option value="All">All Methods</option>
                <option value="Fee Discount">Fee Discount</option>
                <option value="UPI Cash">UPI Cash</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center justify-center gap-1.5 px-3 h-9 rounded-lg border border-border text-xs font-semibold text-danger hover:bg-danger-bg cursor-pointer shrink-0 w-full sm:w-auto motion-safe:transition-colors"
                title="Reset all filters"
              >
                <X size={14} className="text-danger shrink-0" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="mgr-btn mgr-btn-secondary inline-flex items-center justify-center gap-2 text-xs h-9 px-4 rounded-lg font-semibold shrink-0 motion-safe:transition-colors w-full sm:w-auto"
            title="Export Referrals CSV"
          >
            <Download size={15} className="shrink-0 text-primary" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Referrals Table - Separate distinct columns */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                {renderSortableHeader('id', tManagerUi('ref_id'))}
                {renderSortableHeader('referrer', tManagerUi('referrer_existing'))}
                {renderSortableHeader('referred', tManagerUi('referred_student'))}
                {renderSortableHeader('date', tManagerUi('date'))}
                {renderSortableHeader('bonus', tManagerUi('bonus'))}
                {renderSortableHeader('method', tManagerUi('payout_method'))}
                {renderSortableHeader('status', tManagerUi('status'))}
                <th scope="col" className="py-3 px-4 text-right align-middle whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary text-xs sm:text-sm align-middle">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Gift size={36} className="text-primary shrink-0" />
                      <p className="font-medium">No referral records matching the search criteria.</p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={onResetFilters}
                          className="mt-1 text-xs text-primary hover:underline font-semibold"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r) => (
                  <ManagerMembersReferralBonusTableRow
                    key={r.id}
                    row={r}
                    onApprove={onApprove}
                    onApplyToRenewal={onApplyToRenewal}
                    onDeleteReferral={onDeleteReferral}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span className="text-center sm:text-left">
              Showing <strong className="text-primary font-semibold">{startItem}–{endItem}</strong> of <strong className="text-primary font-semibold">{totalRows}</strong> referral records
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-1.5">
                <label htmlFor="referrals-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="referrals-rows-per-page"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded-lg border border-border bg-input px-2 h-8 text-xs text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={effectivePage === 0}
                  onClick={() => onPageChange(effectivePage - 1)}
                  className="mgr-btn mgr-btn-secondary h-8 px-3 text-xs disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <ChevronLeft size={15} className="shrink-0 text-primary" />
                  <span>Previous</span>
                </button>
                <span className="text-xs whitespace-nowrap px-1">
                  Page <strong className="text-primary">{effectivePage + 1}</strong> of <strong className="text-primary">{pageCount}</strong>
                </span>
                <button
                  type="button"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => onPageChange(effectivePage + 1)}
                  className="mgr-btn mgr-btn-secondary h-8 px-3 text-xs disabled:opacity-40 inline-flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight size={15} className="shrink-0 text-primary" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
