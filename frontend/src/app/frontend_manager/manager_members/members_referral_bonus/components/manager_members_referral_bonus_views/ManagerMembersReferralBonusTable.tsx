'use client';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, CheckCircle2, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReferralRow } from '@/app/frontend_manager/manager_members/members_referral_bonus/types/ManagerMembersReferralBonusComponentTypes';

export type ReferralSortField = 'id' | 'referrer' | 'referred' | 'date' | 'bonus' | 'method' | 'status';

interface ManagerMembersReferralBonusTableProps {
  filteredRows: ReferralRow[];
  paginatedRows: ReferralRow[];
  totalRows: number;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: 'All' | 'Credited' | 'Pending';
  setStatusFilter: (val: 'All' | 'Credited' | 'Pending') => void;
  methodFilter: 'All' | 'Fee Discount' | 'UPI Cash';
  setMethodFilter: (val: 'All' | 'Fee Discount' | 'UPI Cash') => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  sortField: ReferralSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: ReferralSortField) => void;
  onApprove: (id: string) => void;
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
        className="py-3 px-4"
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
            <ArrowUpDown size={14} className="text-secondary/40 group-hover:text-secondary transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      {/* Filter and Search Bar */}
      <div className="mgr-card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="mgr-input-icon-wrap flex-1 min-w-[200px] max-w-sm">
              <Search size={15} className="mgr-input-icon text-secondary" />
              <input
                type="search"
                placeholder="Search by referrer, referred student, or Ref ID..."
                className="mgr-input mgr-input-with-icon text-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-40">
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Credited' | 'Pending')}
                className="mgr-select text-xs py-1.5 px-3"
              >
                <option value="All">All Statuses</option>
                <option value="Credited">Credited</option>
                <option value="Pending">Pending Approval</option>
              </select>
            </div>

            <div className="w-full sm:w-40">
              <select
                aria-label="Filter by Reward Method"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value as 'All' | 'Fee Discount' | 'UPI Cash')}
                className="mgr-select text-xs py-1.5 px-3"
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset all filters"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer shrink-0"
            title="Export Referrals CSV"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="mgr-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold text-left">
                {renderSortableHeader('id', tManagerUi('ref_id'))}
                {renderSortableHeader('referrer', tManagerUi('referrer_existing'))}
                {renderSortableHeader('referred', tManagerUi('referred_student'))}
                {renderSortableHeader('date', tManagerUi('date'))}
                {renderSortableHeader('bonus', tManagerUi('bonus'))}
                {renderSortableHeader('method', tManagerUi('payout_method'))}
                {renderSortableHeader('status', tManagerUi('status'))}
                <th scope="col" className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-secondary text-xs">
                    No referral records matching the search criteria.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-hover">
                    <td className="py-3 px-4 font-mono font-bold text-primary text-xs">{r.id}</td>
                    <td className="py-3 px-4 font-semibold text-primary text-xs">{r.referrer}</td>
                    <td className="py-3 px-4 text-primary text-xs">{r.referred}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{r.date}</td>
                    <td className="py-3 px-4 font-bold text-success text-xs">{r.bonus}</td>
                    <td className="py-3 px-4 text-secondary text-xs">{r.method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === 'Credited' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {r.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => onApprove(r.id)}
                          className="mgr-btn-primary mgr-btn-sm text-xs py-1 px-2.5 inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                      ) : (
                        <span className="text-xs text-secondary opacity-50 font-medium">Done</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalRows > 0 && (
          <div className="border-t border-border px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} referral records
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="referrals-rows-per-page" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="referrals-rows-per-page"
                  value={pageSize}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="rounded border border-border bg-input px-2 py-1 text-xs text-primary"
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
                  className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-xs">
                  Page {effectivePage + 1} of {pageCount}
                </span>
                <button
                  type="button"
                  disabled={effectivePage >= pageCount - 1}
                  onClick={() => onPageChange(effectivePage + 1)}
                  className="mgr-btn mgr-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
