'use client';

import React from 'react';
import { Search, X, Download } from 'lucide-react';
import ManagerFinanceFinesPaymentsNativeTable, { type NativeColumn } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';
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
    return (
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">{tabLabel}</h2>
            <p className="text-xs text-secondary mt-0.5">
              Filter, inspect, and export {activeTab === 'pending' ? 'pending' : 'partially paid'} student dues
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search fine ID, member, or type..."
                className="mgr-input pl-8 text-xs w-full"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter by Fine Type"
              value={fineTypeFilter}
              onChange={(e) => onFineTypeFilterChange(e.target.value)}
              className="mgr-select text-xs py-1.5 px-3 min-w-[140px]"
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={onExportPendingFinesCsv}
              className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
              title="Export Fines CSV"
            >
              <Download size={13} /> Export CSV
            </button>

            <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
              Showing {filteredPendingFines.length} Fines ({timeHorizonLabel})
            </span>
          </div>
        </div>
        <div className="flex-1 w-full h-96">
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No ${activeTab === 'pending' ? 'pending' : 'partially paid'} fines found for ${timeHorizonLabel}.`}
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
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">{tabLabel}</h2>
            <p className="text-xs text-secondary mt-0.5">Historical log of settled fines and penalty collections</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search receipt, member, or collector..."
                className="mgr-input pl-8 text-xs w-full"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter by Payment Mode"
              value={historyModeFilter}
              onChange={(e) => onHistoryModeFilterChange(e.target.value)}
              className="mgr-select text-xs py-1.5 px-3 min-w-[130px]"
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={onExportHistoryCsv}
              className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
              title="Export Payment History CSV"
            >
              <Download size={13} /> Export CSV
            </button>

            <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
              Showing {filteredHistoryRows.length} Payments ({timeHorizonLabel})
            </span>
          </div>
        </div>
        <div className="flex-1 w-full h-96">
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
      <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-primary">{tabLabel}</h2>
            <p className="text-xs text-secondary mt-1">Official transaction receipts with late fees, plan details, and multi-channel dispatch</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                type="search"
                placeholder="Search txn ID, receipt, member, plan..."
                className="mgr-input pl-8 text-xs w-full"
                value={tableSearchQuery}
                onChange={(e) => onTableSearchQueryChange(e.target.value)}
              />
            </div>

            <select
              aria-label="Filter Receipts by Mode"
              value={receiptModeFilter}
              onChange={(e) => onReceiptModeFilterChange(e.target.value)}
              className="mgr-select text-xs py-1.5 px-3 min-w-[130px]"
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
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer"
                title="Reset filters"
              >
                <X size={13} /> Reset
              </button>
            )}

            <button
              type="button"
              onClick={onExportReceiptsCsv}
              className="mgr-btn-outline flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border border-border bg-card hover:bg-surface-highlight transition-colors cursor-pointer"
              title="Export Receipts CSV"
            >
              <Download size={13} /> Export CSV
            </button>

            <span className="mgr-badge mgr-badge--info font-mono text-xs shrink-0">
              Showing {filteredReceiptRows.length} of {totalReceiptsCount} Receipts ({timeHorizonLabel})
            </span>
          </div>
        </div>
        <div className="flex-1 w-full h-96">
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

