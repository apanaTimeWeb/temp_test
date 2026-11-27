'use client';

import { Download, MessageSquare, Printer, QrCode, Search, X } from 'lucide-react';

interface ManagerFinanceAutoSuspendHeaderProps {
  title: string;
  subtitle: string;
  onOpenKiosk: () => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export function ManagerFinanceAutoSuspendHeader({
  title,
  subtitle,
  onOpenKiosk,
  onExportCsv,
  onPrint,
}: ManagerFinanceAutoSuspendHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">{title}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
            Active Suspension Policy
          </span>
        </div>
        <p className="text-sm text-secondary mt-1">{subtitle}</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
        <button
          type="button"
          data-testid="open-gate-kiosk-simulator-btn"
          onClick={onOpenKiosk}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs motion-safe:transition-colors cursor-pointer active:scale-95 flex-1 sm:flex-initial"
          title="Simulate Entrance Gate Turnstile QR Kiosk Scanner"
        >
          <QrCode size={14} />
          <span>Test Gate QR Kiosk</span>
        </button>
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer motion-safe:transition-all active:scale-95 flex-1 sm:flex-initial"
          title="Export Suspended Students CSV"
        >
          <Download size={14} className="text-secondary" />
          <span>Export CSV</span>
        </button>
        <button
          type="button"
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary border border-border shadow-2xs cursor-pointer motion-safe:transition-all active:scale-95 flex-1 sm:flex-initial"
          title="Print Policy Report"
        >
          <Printer size={14} className="text-secondary" />
          <span>Print / PDF</span>
        </button>
      </div>
    </div>
  );
}

interface ManagerFinanceAutoSuspendFilterBarProps {
  searchQuery: string;
  shiftFilter: string;
  overdueFilter: string;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (val: string) => void;
  onShiftChange: (val: string) => void;
  onOverdueChange: (val: string) => void;
  onResetFilters: () => void;
  onBulkWhatsApp: () => void;
}

export function ManagerFinanceAutoSuspendFilterBar({
  searchQuery,
  shiftFilter,
  overdueFilter,
  hasActiveFilters,
  filteredCount,
  totalCount,
  onSearchChange,
  onShiftChange,
  onOverdueChange,
  onResetFilters,
  onBulkWhatsApp,
}: ManagerFinanceAutoSuspendFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            maxLength={30}
            type="text"
            placeholder="Search student, smart ID, or seat..."
            className="mgr-input !pl-10 !pr-9 text-xs w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <select
          aria-label="Filter by Shift"
          value={shiftFilter}
          onChange={(e) => onShiftChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer flex-1 sm:flex-initial min-w-[120px] outline-none"
        >
          <option value="all">All Shifts</option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
          <option value="Night">Night</option>
          <option value="Full Day">Full Day</option>
        </select>

        <select
          aria-label="Filter by Overdue Days"
          value={overdueFilter}
          onChange={(e) => onOverdueChange(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-primary hover:border-primary shadow-xs cursor-pointer flex-1 sm:flex-initial min-w-[130px] outline-none"
        >
          <option value="all">All Overdue</option>
          <option value="7">{'> 7 Days Overdue'}</option>
          <option value="14">{'> 14 Days Overdue'}</option>
          <option value="30">{'> 30 Days Overdue'}</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover cursor-pointer motion-safe:transition-colors"
            title="Reset all filters"
          >
            <X size={13} /> Reset
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={onBulkWhatsApp}
          disabled={filteredCount === 0}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs motion-safe:transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Send WhatsApp suspension notices to all filtered students"
        >
          <MessageSquare size={13} />
          <span>Bulk WhatsApp ({filteredCount})</span>
        </button>
        <div className="text-xs text-secondary font-medium flex items-center gap-1.5">
          <span>Showing</span>
          <span className="font-bold text-primary">{filteredCount}</span>
          <span>of {totalCount} students</span>
        </div>
      </div>
    </div>
  );
}
