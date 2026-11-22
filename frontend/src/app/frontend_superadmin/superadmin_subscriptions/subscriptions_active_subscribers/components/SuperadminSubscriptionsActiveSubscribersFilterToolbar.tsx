'use client';

import { Search, X, RotateCcw, Download, FileSpreadsheet, Printer, MessageSquare } from 'lucide-react';

export interface SuperadminSubscriptionsActiveSubscribersFilterToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  planFilter: string;
  setPlanFilter: (p: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  cycleFilter: string;
  setCycleFilter: (c: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onPrintRoster: () => void;
  onBulkWhatsApp?: () => void;
  filteredCount?: number;
}

export function SuperadminSubscriptionsActiveSubscribersFilterToolbar({
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  statusFilter,
  setStatusFilter,
  cycleFilter,
  setCycleFilter,
  hasActiveFilters,
  onResetFilters,
  onExportCsv,
  onExportExcel,
  onPrintRoster,
  onBulkWhatsApp,
  filteredCount,
}: SuperadminSubscriptionsActiveSubscribersFilterToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex-wrap">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] w-full sm:w-auto">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
        <input maxLength={100}
          type="search"
          placeholder="Search by tenant, plan, contact..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-indigo-500/25 bg-input text-white placeholder:text-secondary focus:border-indigo-400 focus:outline-none transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors cursor-pointer p-0.5"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Plan Filter */}
      <select
        aria-label="Filter by plan"
        value={planFilter}
        onChange={(e) => setPlanFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Plans</option>
        <option value="Enterprise">Enterprise</option>
        <option value="Pro">Pro</option>
        <option value="Starter">Starter</option>
      </select>

      {/* Status Filter */}
      <select
        aria-label="Filter by status"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Statuses</option>
        <option value="Paid">Paid</option>
        <option value="Due Soon">Due Soon</option>
        <option value="Overdue">Overdue</option>
      </select>

      {/* Cycle Filter */}
      <select
        aria-label="Filter by billing cycle"
        value={cycleFilter}
        onChange={(e) => setCycleFilter(e.target.value)}
        className="rounded-xl border border-indigo-500/25 bg-card px-3 py-2 text-xs font-medium text-white hover:border-indigo-400 focus:outline-none shadow-xs cursor-pointer w-full sm:w-auto"
      >
        <option value="all">All Cycles</option>
        <option value="Monthly">Monthly</option>
        <option value="Annual">Annual</option>
      </select>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold cursor-pointer transition-all w-full sm:w-auto justify-center"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      )}

      {/* Action / Export Toolbar Buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
        {onBulkWhatsApp && (
          <button
            type="button"
            onClick={onBulkWhatsApp}
            disabled={(filteredCount ?? 0) === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-semibold text-emerald-300 transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            title="Broadcast WhatsApp to filtered subscribers"
          >
            <MessageSquare size={13} className="text-emerald-400" />
            <span>Bulk WhatsApp ({filteredCount ?? 0})</span>
          </button>
        )}

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/25 bg-card hover:bg-card-hover text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
          title="Export Active Subscribers as CSV"
        >
          <Download size={13} className="text-indigo-400" />
          <span>CSV</span>
        </button>

        <button
          type="button"
          onClick={onExportExcel}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 transition-all cursor-pointer shadow-xs"
          title="Export Active Subscribers as Excel (.xls)"
        >
          <FileSpreadsheet size={13} className="text-emerald-400" />
          <span>Excel</span>
        </button>

        <button
          type="button"
          onClick={onPrintRoster}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-500/25 bg-card hover:bg-card-hover text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs"
          title="Print Active Subscribers Directory"
        >
          <Printer size={13} className="text-slate-400" />
          <span>Print</span>
        </button>
      </div>
    </div>
  );
}
export default SuperadminSubscriptionsActiveSubscribersFilterToolbar;
