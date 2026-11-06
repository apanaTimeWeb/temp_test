'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Search, Download, Calendar } from 'lucide-react';

interface ManagerAttendanceDailyToolbarProps {
  date: string;
  setDate: (d: string) => void;
  todayStr: string;
  yesterdayStr: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  shift: string;
  setShift: (s: string) => void;
  present: number;
  absent: number;
  late: number;
  startItem: number;
  endItem: number;
  totalRows: number;
  dateLabel: string;
  onExportCsv: () => void;
  onResetPage: () => void;
}

export function ManagerAttendanceDailyToolbar({
  date,
  setDate,
  todayStr,
  yesterdayStr,
  searchQuery,
  setSearchQuery,
  shift,
  setShift,
  present,
  absent,
  late,
  startItem,
  endItem,
  totalRows,
  dateLabel,
  onExportCsv,
  onResetPage,
}: ManagerAttendanceDailyToolbarProps) {
  const tManagerUi = useTranslations('manager.manager_attendance.ui');

  return (
    <>
      {/* ── Specific Date Navigator Bar ── */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-primary shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider text-secondary">
            Register Roll Date:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Date Selectors: Today | Yesterday */}
          <div className="inline-flex bg-muted p-1 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => {
                setDate(todayStr);
                onResetPage();
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                date === todayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => {
                setDate(yesterdayStr);
                onResetPage();
              }}
              className={`min-h-8 px-3 py-1 text-xs font-medium rounded-lg motion-safe:transition-all ${
                date === yesterdayStr
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              Yesterday
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl border border-border">
            <input
              id="rbg4-managerengagementattendancepage-103"
              type="date"
              className="px-2.5 py-1 bg-card border border-border rounded-lg text-xs font-semibold text-primary outline-none focus:border-primary cursor-pointer"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                onResetPage();
              }}
              aria-label={tManagerUi('date')}
            />
          </div>
        </div>
      </div>

      {/* ── Filters & Search Toolbar ── */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
              <input
                id="daily-att-search"
                type="search"
                placeholder="Search student name or smart ID..."
                className="w-full pl-9 pr-3 py-1.5 bg-muted border border-border rounded-lg text-xs text-primary outline-none focus:border-primary focus:bg-card"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onResetPage();
                }}
              />
            </div>

            {/* Shift Selector */}
            <div className="flex items-center gap-1.5">
              <select
                id="rbg4-managerengagementattendancepage-108"
                className="min-h-9 py-1 px-3 bg-muted border border-border rounded-lg text-xs font-medium text-primary outline-none focus:border-primary focus:bg-card cursor-pointer"
                value={shift}
                onChange={(e) => {
                  setShift(e.target.value);
                  onResetPage();
                }}
              >
                <option value="All">{tManagerUi('all')}</option>
                <option value="Morning">{tManagerUi('morning')}</option>
                <option value="Afternoon">{tManagerUi('afternoon')}</option>
                <option value="Evening">{tManagerUi('evening')}</option>
                <option value="Night">Night</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>

            {/* Status Counter Badges */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded-full font-bold bg-success-bg text-success border border-border">
                {present} {tManagerUi('present')}
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-danger-bg text-danger border border-border">
                {absent} {tManagerUi('absent')}
              </span>
              <span className="px-2 py-0.5 rounded-full font-bold bg-warning-bg text-warning border border-border">
                {late} {tManagerUi('late')}
              </span>
              <span className="text-xs font-semibold text-secondary px-1 shrink-0">
                Showing {startItem}-{endItem} of {totalRows} students ({dateLabel})
              </span>
            </div>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold text-secondary hover:text-primary hover:border-border-strong hover:bg-surface-hover motion-safe:transition-all shadow-sm shrink-0"
            title="Export Attendance Register as CSV"
          >
            <Download size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </>
  );
}

