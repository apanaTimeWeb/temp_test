'use client';

// RESPONSIBILITY: Render month selector, search input, shift filter, and CSV/Print actions for monthly attendance.

import { MONTH_OPTIONS } from '@/app/frontend_manager/manager_attendance/attendance_monthly_history/constants/ManagerAttendanceMonthlyHistoryConstants';
import { Calendar, Download, Printer, Search, X } from 'lucide-react';

interface ManagerAttendanceMonthlyHistoryToolbarProps {
  selectedMonth: string;
  onSelectMonth: (monthId: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedShift: string;
  onSelectShift: (shift: string) => void;
  onExportCsv: () => void;
  onPrint: () => void;
}

export function ManagerAttendanceMonthlyHistoryToolbar({
  selectedMonth,
  onSelectMonth,
  searchQuery,
  onSearchChange,
  selectedShift,
  onSelectShift,
  onExportCsv,
  onPrint,
}: ManagerAttendanceMonthlyHistoryToolbarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary mr-1 shrink-0">
            Select Month:
          </span>
          {MONTH_OPTIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMonth(m.id)}
              className={`px-3 py-1.5 text-xs rounded-xl font-semibold motion-safe:transition-all cursor-pointer whitespace-nowrap ${
                selectedMonth === m.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted text-secondary hover:text-primary border border-border'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-2xs"
            title="Export Month-wise CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-hover motion-safe:transition-colors cursor-pointer shadow-2xs"
            title="Print Monthly Register"
          >
            <Printer size={13} />
            <span>Print Register</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          <input
            maxLength={30}
            type="search"
            aria-label="Search member name, smart ID, or seat"
            placeholder="Search member name, smart ID, or seat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-muted border border-border rounded-xl text-xs text-primary outline-none focus:border-primary focus:bg-card motion-safe:transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-secondary hover:text-primary cursor-pointer p-0.5"
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-xs font-semibold text-secondary shrink-0">Shift Filter:</span>
          {['All', 'Morning', 'Afternoon', 'Evening', 'Night', 'Full Day'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSelectShift(s)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold motion-safe:transition-all cursor-pointer whitespace-nowrap ${
                selectedShift === s
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-card text-secondary hover:text-primary border border-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
