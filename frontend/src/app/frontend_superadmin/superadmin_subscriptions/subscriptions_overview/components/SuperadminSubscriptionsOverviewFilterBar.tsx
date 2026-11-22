'use client';
// RESPONSIBILITY: Filter, search, and export toolbar for SaaS subscriptions overview (< 150 lines).
import { Search, X, RotateCcw, Download, FileSpreadsheet, Printer } from 'lucide-react';

interface SuperadminSubscriptionsOverviewFilterBarProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onReset: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function SuperadminSubscriptionsOverviewFilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onReset,
  onExportCsv,
  onExportExcel,
  onPrint,
  filteredCount,
  totalCount,
}: SuperadminSubscriptionsOverviewFilterBarProps) {
  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
        <input maxLength={100}
          type="search"
          placeholder="Search tenant, plan, contact..."
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

      {/* Status Filter Dropdown */}
      <select
        aria-label="Filter by subscription status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/30 bg-[#060818] px-3 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
      >
        <option value="all">All Subscription Statuses</option>
        <option value="Active">Active</option>
        <option value="Trial">Trial</option>
        <option value="Grace Period">Grace Period</option>
        <option value="Past Due">Past Due</option>
        <option value="Suspended">Suspended</option>
        <option value="Cancelled">Cancelled</option>
        <option value="Expired">Expired</option>
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 bg-rose-500/10 border border-rose-500/30 cursor-pointer"
          title="Reset filters"
        >
          <RotateCcw size={12} />
        </button>
      )}

      {/* Export & Print */}
      <div className="flex items-center gap-1.5 flex-wrap ml-auto">
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold cursor-pointer"
          title="Export filtered subscribers to CSV"
        >
          <Download size={12} />
          <span>CSV</span>
        </button>
        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold cursor-pointer"
          title="Export filtered subscribers to Excel (.xls)"
        >
          <FileSpreadsheet size={12} />
          <span>Excel</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border/60 bg-slate-800/60 text-slate-300 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
          title="Print Subscriptions Report"
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
