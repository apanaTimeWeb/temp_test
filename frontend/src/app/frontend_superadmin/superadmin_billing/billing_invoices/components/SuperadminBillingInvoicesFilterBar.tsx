'use client';
// RESPONSIBILITY: Filter, search, and export toolbar for SuperAdmin billing invoices (< 150 lines).
import { Search, X, RotateCcw, Download, FileSpreadsheet, Printer } from 'lucide-react';

interface SuperadminBillingInvoicesFilterBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  methodFilter: string;
  setMethodFilter: (v: string) => void;
  onReset: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SuperadminBillingInvoicesFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  methodFilter,
  setMethodFilter,
  onReset,
  onExportCsv,
  onExportExcel,
  onPrint,
  filteredCount,
  totalCount,
}: SuperadminBillingInvoicesFilterBarProps) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || methodFilter !== 'all';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 rounded-2xl border border-indigo-500/20 bg-[#080b22]/90 flex-wrap">
      {/* Search Bar */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
        <input
          type="search"
          placeholder="Search invoice ID, tenant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border border-indigo-500/30 bg-[#060818] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
            <X size={12} />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        aria-label="Filter by payment status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/30 bg-[#060818] px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
      >
        <option value="all">All Payment Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Overdue">Overdue</option>
        <option value="Pending">Pending</option>
        <option value="Partially Paid">Partially Paid</option>
        <option value="Failed">Failed</option>
      </select>

      {/* Method Filter */}
      <select
        aria-label="Filter by payment method"
        value={methodFilter}
        onChange={(e) => setMethodFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/30 bg-[#060818] px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
      >
        <option value="all">All Payment Methods</option>
        <option value="UPI">UPI</option>
        <option value="Card">Card</option>
        <option value="NetBanking">Net Banking</option>
      </select>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 bg-rose-500/10 border border-rose-500/30 cursor-pointer"
          title="Clear all filters"
        >
          <RotateCcw size={12} />
        </button>
      )}

      {/* Export & Print Tools */}
      <div className="flex items-center gap-1.5 flex-wrap ml-auto">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer transition-all"
          title="Export filtered invoices to CSV"
        >
          <Download size={12} />
          <span>CSV</span>
        </button>
        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer transition-all"
          title="Export filtered invoices to Excel (.xls)"
        >
          <FileSpreadsheet size={12} />
          <span>Excel</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/60 bg-slate-800/60 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-all"
          title="Print Invoices Summary Report"
        >
          <Printer size={12} />
          <span>Print</span>
        </button>
        <span className="text-xs text-slate-300 font-medium px-2 py-1 rounded-lg bg-slate-900 border border-border/50">
          {filteredCount} of {totalCount}
        </span>
      </div>
    </div>
  );
}
