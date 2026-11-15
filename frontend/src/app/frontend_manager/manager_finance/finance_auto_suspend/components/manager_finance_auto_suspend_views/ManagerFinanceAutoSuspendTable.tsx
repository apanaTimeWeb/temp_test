'use client';

import React from 'react';
import { Bell, RotateCcw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ManagerFinanceAutoSuspendSuspendedStudent as SuspendedStudent } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendTypes';
import { ManagerFinanceAutoSuspendEmptyState } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/components/manager_finance_auto_suspend_empty_states/ManagerFinanceAutoSuspendEmptyState';

export type SuspendSortField = 'studentName' | 'seat' | 'shift' | 'daysOverdue' | 'suspendedSince';

export interface ManagerFinanceAutoSuspendTableProps {
  filtered: SuspendedStudent[];
  paginated: SuspendedStudent[];
  searchQuery: string;
  totalRows: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  effectivePage: number;
  pageCount: number;
  sortField: SuspendSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SuspendSortField) => void;
  onPageSizeChange: (size: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSendReminder: (student: SuspendedStudent) => void;
  onRestoreStudent: (student: SuspendedStudent) => void;
  shiftLabels: Record<string, string>;
  labels: {
    student: string;
    seat: string;
    shift: string;
    lastPaymentDate: string;
    daysOverdue: string;
    suspendedSince: string;
    actions: string;
    noStudents: string;
    sendReminder: string;
    daysSuffix: string;
  };
}

export default function ManagerFinanceAutoSuspendTable({
  filtered,
  paginated,
  searchQuery,
  totalRows,
  startItem,
  endItem,
  pageSize,
  effectivePage,
  pageCount,
  sortField,
  sortDirection,
  onToggleSort,
  onPageSizeChange,
  onPrevPage,
  onNextPage,
  onSendReminder,
  onRestoreStudent,
  shiftLabels,
  labels,
}: ManagerFinanceAutoSuspendTableProps) {
  const renderSortableHeader = (field: SuspendSortField, label: string) => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className="text-left py-3 px-4"
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
            <ArrowUpDown size={14} className="text-secondary opacity-40 group-hover:opacity-100 transition-colors shrink-0" aria-hidden="true" />
          )}
        </button>
      </th>
    );
  };

  return (
    <>
      <table className="w-full min-w-[850px]">
        <thead>
          <tr className="border-b border-border bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {renderSortableHeader('studentName', labels.student)}
            {renderSortableHeader('seat', labels.seat)}
            {renderSortableHeader('shift', labels.shift)}
            <th className="text-left py-3 px-4">{labels.lastPaymentDate}</th>
            {renderSortableHeader('daysOverdue', labels.daysOverdue)}
            {renderSortableHeader('suspendedSince', labels.suspendedSince)}
            <th className="text-right py-3 px-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <ManagerFinanceAutoSuspendEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">🔓</div>
                  <p className="fin-empty-state__title">
                    {searchQuery ? 'No suspended students matching the search query.' : labels.noStudents}
                  </p>
                </ManagerFinanceAutoSuspendEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-14 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-semibold text-primary text-sm">{s.studentName}</div>
                  <div className="text-xs text-secondary font-mono">{s.smartId}</div>
                </td>
                <td className="py-3 px-4 font-medium text-primary text-sm">{s.seat}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface border border-border text-secondary">
                    {shiftLabels[s.shift] ?? s.shift}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-secondary">—</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {s.daysOverdue}{labels.daysSuffix}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-secondary">{s.suspendedSince}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onSendReminder(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-surface-hover hover:border-primary text-secondary hover:text-primary text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                      title={`Send reminder to ${s.studentName}`}
                    >
                      <Bell size={13} className="text-amber-500" />
                      <span>{labels.sendReminder}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onRestoreStudent(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95"
                      title={`Manually restore ${s.studentName}`}
                    >
                      <RotateCcw size={13} />
                      <span>Restore</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalRows > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
          <span className="text-xs sm:text-sm text-center sm:text-left">
            Showing {startItem}–{endItem} of {totalRows} results
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <label htmlFor="rows-per-page-finance-auto-suspend" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-finance-auto-suspend"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="rounded border border-border bg-surface px-2 py-1 text-xs text-primary"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage <= 0}
                onClick={onPrevPage}
              >
                Previous
              </button>
              <span className="text-xs text-secondary px-1 whitespace-nowrap">
                Page {effectivePage + 1} of {pageCount}
              </span>
              <button
                type="button"
                className="mgr-btn-ghost mgr-btn-sm"
                disabled={effectivePage >= pageCount - 1}
                onClick={onNextPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

