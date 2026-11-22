'use client';

import ManagerFinanceFinesPaymentsNativeTable,{ type NativeColumn } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';
import { Download,Search,X } from 'lucide-react';
import type { ManagerReceiptRecord } from './ManagerFinanceFinesPaymentsFinesAndPaymentsPage';

export interface ManagerFinanceFinesPaymentsTablesSectionProps {
  activeTab: string;
  tableSearchQuery: string;
  onTableSearchQueryChange: (val: string) => void;
  fineTypeFilter: string;
  onFineTypeFilterChange: (val: string) => void;
  historyModeFilter: string;
  onHistoryModeFilterChange: (val: string) => void;
  receiptModeFilter: string;
  onReceiptModeFilterChange: (val: string) => void;
  onResetFilters: () => void;
  timeHorizon: string;
  timeHorizonLabel: string;
  filteredPendingFines: Array<{ id: string; member: string; type: string; amount: number; date: string; status: string }>;
  filteredHistoryRows: Array<{ id: string; member: string; type: string; amount: number; mode: string; date: string; collectedBy: string; receipt?: string }>;
  filteredReceiptRows: ManagerReceiptRecord[];
  totalReceiptsCount: number;
  pendingCols: NativeColumn[];
  historyCols: NativeColumn[];
  receiptsCols: NativeColumn[];
  onExportPendingFinesCsv: () => void;
  onExportHistoryCsv: () => void;
  onExportReceiptsCsv: () => void;
  tabLabel: string;
  emptySearchMessage: string;
  prevPageLabel: string;
  nextPageLabel: string;
}

export default function ManagerFinanceFinesPaymentsTablesSection({
  activeTab,
  tableSearchQuery,
  onTableSearchQueryChange,
  fineTypeFilter,
  onFineTypeFilterChange,
  historyModeFilter,
  onHistoryModeFilterChange,
  receiptModeFilter,
  onReceiptModeFilterChange,
  onResetFilters,
  timeHorizon,
  timeHorizonLabel,
  filteredPendingFines,
  filteredHistoryRows,
  filteredReceiptRows,
  totalReceiptsCount,
  pendingCols,
  historyCols,
  receiptsCols,
  onExportPendingFinesCsv,
  onExportHistoryCsv,
  onExportReceiptsCsv,
  tabLabel,
  emptySearchMessage,
  prevPageLabel,
  nextPageLabel,
}: ManagerFinanceFinesPaymentsTablesSectionProps) {
  if (activeTab === 'pending' || activeTab === 'partiallyPaid') {
    const isPending = activeTab === 'pending';
    return (
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
        {/* Table Header Row: Title & Subtitle + Fast Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-primary tracking-tight">{tabLabel}</h2>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isPending
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isPending ? 'bg-rose-500' : 'bg-amber-500'}`} />
                {filteredPendingFines.length} {isPending ? 'Pending Dues' : 'Partial Dues'}
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Filter, inspect, and export {isPending ? 'pending' : 'partially paid'} student fine records.
            </p>
          </div>

          <button
            type="button"
            onClick={onExportPendingFinesCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 self-start sm:self-center"
            title="Export Fines CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Dedicated Search & Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search fine ID, member, or type..."
                className="mgr-input !pl-10 !pr-9 text-xs w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
              {tableSearchQuery && (
                <button
                  type="button"
                  onClick={() => onTableSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by Fine Type"
              value={fineTypeFilter}
              onChange={(e) => onFineTypeFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[140px] outline-none"
            >
              <option value="all">All Fine Types</option>
              <option value="Overdue Book">Overdue Book</option>
              <option value="Lost Book Charge">Lost Book Charge</option>
              <option value="Damage Charge">Damage Charge</option>
              <option value="Late Fee">Late Fee</option>
            </select>

            {(tableSearchQuery.trim() !== '' || fineTypeFilter !== 'all' || timeHorizon !== 'all') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>

          <div className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-bold text-primary">{filteredPendingFines.length}</span>
            <span>records ({timeHorizonLabel})</span>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 w-full min-h-80">
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No ${isPending ? 'pending' : 'partially paid'} fines found for ${timeHorizonLabel}.`}
            rows={filteredPendingFines}
            columns={pendingCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'paid') {
    return (
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
        {/* Table Header Row: Title & Subtitle + Fast Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-primary tracking-tight">{tabLabel}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {filteredHistoryRows.length} Settled Payments
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Historical ledger of cleared fine collections and penalty settlements.
            </p>
          </div>

          <button
            type="button"
            onClick={onExportHistoryCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 self-start sm:self-center"
            title="Export Payment History CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Dedicated Search & Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search receipt, member, or collector..."
                className="mgr-input !pl-10 !pr-9 text-xs w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
              {tableSearchQuery && (
                <button
                  type="button"
                  onClick={() => onTableSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter by Payment Mode"
              value={historyModeFilter}
              onChange={(e) => onHistoryModeFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none"
            >
              <option value="all">All Modes</option>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="bank">Bank Transfer</option>
            </select>

            {(tableSearchQuery.trim() !== '' || historyModeFilter !== 'all' || timeHorizon !== 'all') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>

          <div className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-bold text-primary">{filteredHistoryRows.length}</span>
            <span>settled records ({timeHorizonLabel})</span>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 w-full min-h-80">
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No payment history records found for ${timeHorizonLabel}.`}
            rows={filteredHistoryRows}
            columns={historyCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        </div>
      </div>
    );
  }

  if (activeTab === 'receipts') {
    return (
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
        {/* Table Header Row: Title & Subtitle + Fast Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold text-primary tracking-tight">{tabLabel}</h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                {filteredReceiptRows.length} of {totalReceiptsCount} Receipts
              </span>
            </div>
            <p className="text-xs text-secondary mt-1">
              Official transaction receipts with late fees, plan details, and multi-channel dispatch.
            </p>
          </div>

          <button
            type="button"
            onClick={onExportReceiptsCsv}
            className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 self-start sm:self-center"
            title="Export Receipts CSV"
          >
            <Download size={14} className="text-secondary" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Dedicated Search & Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            <div className="relative w-full sm:w-72">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              <input
                type="text"
                placeholder="Search txn ID, receipt, member, plan..."
                className="mgr-input !pl-10 !pr-9 text-xs w-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
              {tableSearchQuery && (
                <button
                  type="button"
                  onClick={() => onTableSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
                  title="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <select
              aria-label="Filter Receipts by Mode"
              value={receiptModeFilter}
              onChange={(e) => onReceiptModeFilterChange(e.target.value)}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer w-full sm:w-auto min-w-[130px] outline-none"
            >
              <option value="all">All Modes</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            {(tableSearchQuery.trim() !== '' || receiptModeFilter !== 'all' || timeHorizon !== 'all') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer transition-colors"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}
          </div>

          <div className="text-xs text-secondary font-medium shrink-0 flex items-center gap-1.5">
            <span>Showing</span>
            <span className="font-bold text-primary">{filteredReceiptRows.length}</span>
            <span>of {totalReceiptsCount} receipts ({timeHorizonLabel})</span>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 w-full min-h-80">
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No receipts found for ${timeHorizonLabel}.`}
            rows={filteredReceiptRows}
            columns={receiptsCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        </div>
      </div>
    );
  }

  return null;
}

