'use client';

import ManagerFinanceFinesPaymentsNativeTable, { type NativeColumn } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_table_parts/ManagerFinanceFinesPaymentsNativeTable';
import type { ManagerReceiptRecord } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage';
import ManagerFinanceFinesPaymentsTableFilterBar from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsTableFilterBar';
import { Download } from 'lucide-react';

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

const FINE_TYPE_OPTIONS = [
  { value: 'all', label: 'All Fine Types' },
  { value: 'Overdue Book', label: 'Overdue Book' },
  { value: 'Lost Book Charge', label: 'Lost Book Charge' },
  { value: 'Damage Charge', label: 'Damage Charge' },
  { value: 'Late Fee', label: 'Late Fee' },
];

const HISTORY_MODE_OPTIONS = [
  { value: 'all', label: 'All Modes' },
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'bank', label: 'Bank Transfer' },
];

const RECEIPT_MODE_OPTIONS = [
  { value: 'all', label: 'All Modes' },
  { value: 'Cash', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'Card', label: 'Card' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

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
  const isPendingTab = activeTab === 'pending' || activeTab === 'partiallyPaid';
  const isPaidTab = activeTab === 'paid';
  const isReceiptsTab = activeTab === 'receipts';
  if (!isPendingTab && !isPaidTab && !isReceiptsTab) return null;

  const isPending = activeTab === 'pending';
  const badgeTone = isPendingTab
    ? isPending
      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    : isPaidTab
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  const dotTone = isPendingTab ? (isPending ? 'bg-rose-500' : 'bg-amber-500') : isPaidTab ? 'bg-emerald-500' : 'bg-blue-500';
  const subtitle = isPendingTab
    ? `Filter, inspect, and export ${isPending ? 'pending' : 'partially paid'} student fine records.`
    : isPaidTab
      ? 'Historical ledger of cleared fine collections and penalty settlements.'
      : 'Official transaction receipts with late fees, plan details, and multi-channel dispatch.';
  const countText = isPendingTab
    ? `${filteredPendingFines.length} ${isPending ? 'Pending Dues' : 'Partial Dues'}`
    : isPaidTab
      ? `${filteredHistoryRows.length} Settled Payments`
      : `${filteredReceiptRows.length} of ${totalReceiptsCount} Receipts`;

  return (
    <div className="motion-safe:transition-all motion-safe:duration-base h-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl font-bold text-primary tracking-tight">{tabLabel}</h2>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeTone}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotTone}`} />
              {countText}
            </span>
          </div>
          <p className="text-xs text-secondary mt-1">{subtitle}</p>
        </div>

        <button
          type="button"
          onClick={isPendingTab ? onExportPendingFinesCsv : isPaidTab ? onExportHistoryCsv : onExportReceiptsCsv}
          className="inline-flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl border border-border bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary motion-safe:transition-all cursor-pointer shadow-xs active:scale-95 shrink-0 self-start sm:self-center"
          title={isPendingTab ? 'Export Fines CSV' : isPaidTab ? 'Export Payment History CSV' : 'Export Receipts CSV'}
        >
          <Download size={14} className="text-secondary" />
          <span>Export CSV</span>
        </button>
      </div>

      <ManagerFinanceFinesPaymentsTableFilterBar
        searchQuery={tableSearchQuery}
        searchPlaceholder={isPendingTab ? 'Search fine ID, member, or type...' : isPaidTab ? 'Search receipt, member, or collector...' : 'Search txn ID, receipt, member, plan...'}
        maxLength={isPaidTab ? 100 : 30}
        selectAriaLabel={isPendingTab ? 'Filter by Fine Type' : isPaidTab ? 'Filter by Payment Mode' : 'Filter Receipts by Mode'}
        selectValue={isPendingTab ? fineTypeFilter : isPaidTab ? historyModeFilter : receiptModeFilter}
        selectOptions={isPendingTab ? FINE_TYPE_OPTIONS : isPaidTab ? HISTORY_MODE_OPTIONS : RECEIPT_MODE_OPTIONS}
        hasActiveFilter={
          tableSearchQuery.trim() !== '' ||
          timeHorizon !== 'all' ||
          (isPendingTab ? fineTypeFilter !== 'all' : isPaidTab ? historyModeFilter !== 'all' : receiptModeFilter !== 'all')
        }
        filteredCount={isPendingTab ? filteredPendingFines.length : isPaidTab ? filteredHistoryRows.length : filteredReceiptRows.length}
        summaryText={isPendingTab ? `records (${timeHorizonLabel})` : isPaidTab ? `settled records (${timeHorizonLabel})` : `of ${totalReceiptsCount} receipts (${timeHorizonLabel})`}
        onSearchChange={onTableSearchQueryChange}
        onSelectChange={isPendingTab ? onFineTypeFilterChange : isPaidTab ? onHistoryModeFilterChange : onReceiptModeFilterChange}
        onReset={onResetFilters}
      />

      <div className="flex-1 w-full min-h-80">
        {isPendingTab && (
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No ${isPending ? 'pending' : 'partially paid'} fines found for ${timeHorizonLabel}.`}
            rows={filteredPendingFines}
            columns={pendingCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        )}
        {isPaidTab && (
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No payment history records found for ${timeHorizonLabel}.`}
            rows={filteredHistoryRows}
            columns={historyCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        )}
        {isReceiptsTab && (
          <ManagerFinanceFinesPaymentsNativeTable
            getRowKey={(row) => String(row.id)}
            emptyMessage={tableSearchQuery ? emptySearchMessage : `No receipts found for ${timeHorizonLabel}.`}
            rows={filteredReceiptRows}
            columns={receiptsCols}
            labels={{ previous: prevPageLabel, next: nextPageLabel }}
          />
        )}
      </div>
    </div>
  );
}
