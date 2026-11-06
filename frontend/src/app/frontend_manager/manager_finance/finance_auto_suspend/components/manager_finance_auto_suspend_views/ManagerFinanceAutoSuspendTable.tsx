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
      <table className="w-full">
        <thead>
          <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
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
              <tr key={s.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                <td className="py-3 px-4">
                  <div className="fin-cell-name">{s.studentName}</div>
                  <div className="fin-cell-subtext">{s.smartId}</div>
                </td>
                <td className="py-3 px-4 fin-text-body">{s.seat}</td>
                <td className="py-3 px-4">
                  <span className="fin-badge fin-badge--neutral">{shiftLabels[s.shift] ?? s.shift}</span>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">—</td>
                <td className="py-3 px-4">
                  <span className="fin-text-danger font-semibold">{s.daysOverdue}{labels.daysSuffix}</span>
                </td>
                <td className="py-3 px-4 fin-cell-subtext">{s.suspendedSince}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onSendReminder(s)}
                      className="fin-badge fin-badge--neutral cursor-pointer hover:opacity-80 transition-opacity"
                      title={`Send reminder to ${s.studentName}`}
                    >
                      <Bell size={11} /> {labels.sendReminder}
                    </button>
                    <button
                      type="button"
                      onClick={() => onRestoreStudent(s)}
                      className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 transition-opacity"
                      title={`Manually restore ${s.studentName}`}
                    >
                      <RotateCcw size={11} /> Restore
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
          <span>
            Showing {startItem}–{endItem} of {totalRows} results
          </span>
          <div className="flex items-center gap-4">
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
              <span className="text-xs text-secondary px-1">
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

