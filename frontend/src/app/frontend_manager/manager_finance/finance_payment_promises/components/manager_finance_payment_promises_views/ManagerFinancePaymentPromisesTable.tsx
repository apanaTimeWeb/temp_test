'use client';

import React from 'react';
import { CheckCircle, CalendarPlus, Eye, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';
import { MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/constants/ManagerFinancePaymentPromisesPaymentPromiseConstants';
import { ManagerFinancePaymentPromisesEmptyState } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_empty_states/ManagerFinancePaymentPromisesEmptyState';

export type PromiseSortField = 'studentName' | 'promisedAmount' | 'expectedDate' | 'daysUntilDue' | 'status' | 'timesChanged';

export interface ManagerFinancePaymentPromisesTableProps {
  filtered: ManagerFinancePaymentPromisesPaymentPromiseSample[];
  paginated: ManagerFinancePaymentPromisesPaymentPromiseSample[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  sortField: PromiseSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: PromiseSortField) => void;
  onMarkPaid: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  onOpenEdit: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  startItem: number;
  endItem: number;
  totalRows: number;
  effectivePage: number;
  pageCount: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  labels: {
    student: string;
    promisedInr: string;
    expectedDate: string;
    daysUntilSinceDue: string;
    timesChanged: string;
    status: string;
    actions: string;
    noPromises: string;
    paidOn: string;
    daysOverdueCount: (count: number) => string;
    daysCount: (count: number) => string;
    translateStatus: (s: string) => string;
  };
}

export default function ManagerFinancePaymentPromisesTable({
  filtered,
  paginated,
  formatCurrency,
  formatDate,
  sortField,
  sortDirection,
  onToggleSort,
  onMarkPaid,
  onOpenEdit,
  startItem,
  endItem,
  totalRows,
  effectivePage,
  pageCount,
  onPrevPage,
  onNextPage,
  labels,
}: ManagerFinancePaymentPromisesTableProps) {
  const renderSortableHeader = (field: PromiseSortField, label: string, align: 'left' | 'right' = 'left') => {
    const isActive = sortField === field;
    return (
      <th
        scope="col"
        aria-sort={isActive ? (sortDirection === 'asc' ? 'ascending' : 'descending') : undefined}
        className={`py-3 px-4 ${align === 'right' ? 'text-right' : 'text-left'}`}
      >
        <button
          type="button"
          onClick={() => onToggleSort(field)}
          className={`group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -mx-1 ${align === 'right' ? 'ml-auto' : ''}`}
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
    <div className="fin-card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
            {renderSortableHeader('studentName', labels.student, 'left')}
            {renderSortableHeader('promisedAmount', labels.promisedInr, 'right')}
            {renderSortableHeader('expectedDate', labels.expectedDate, 'left')}
            {renderSortableHeader('daysUntilDue', labels.daysUntilSinceDue, 'left')}
            {renderSortableHeader('timesChanged', labels.timesChanged, 'left')}
            {renderSortableHeader('status', labels.status, 'left')}
            <th scope="col" className="text-right py-3 px-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7}>
                <ManagerFinancePaymentPromisesEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">🤝</div>
                  <p className="fin-empty-state__title">{labels.noPromises}</p>
                </ManagerFinancePaymentPromisesEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((p) => (
              <tr
                key={p.id}
                className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra h-12"
              >
                <td className="py-3 px-4">
                  <div className="fin-cell-name font-semibold">{p.studentName}</div>
                  <div className="fin-cell-subtext font-mono">{p.smartId}</div>
                </td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(p.promisedAmount)}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(p.expectedDate)}</td>
                <td className="py-3 px-4">
                  <span
                    className={
                      p.daysUntilDue < 0
                        ? 'fin-text-danger font-semibold'
                        : p.daysUntilDue <= 3
                          ? 'fin-text-warning'
                          : 'fin-text-body'
                    }
                  >
                    {p.daysUntilDue < 0
                      ? labels.daysOverdueCount(Math.abs(p.daysUntilDue))
                      : labels.daysCount(p.daysUntilDue)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.timesChanged >= 3 ? (
                    <span className="fin-badge fin-badge--danger">{p.timesChanged}x changed</span>
                  ) : p.timesChanged > 0 ? (
                    <span className="fin-badge fin-badge--warning">{p.timesChanged}x changed</span>
                  ) : (
                    <span className="fin-text-muted">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE[p.status] || 'fin-badge fin-badge--neutral'}>
                    {labels.translateStatus(p.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {p.status !== 'fulfilled' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onMarkPaid(p)}
                        className="fin-badge fin-badge--success cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="Mark payment promise as cleared"
                      >
                        <CheckCircle size={11} /> Mark Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEdit(p)}
                        className="fin-badge fin-badge--warning cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="Edit promise amount or extend expected date"
                      >
                        <CalendarPlus size={11} /> Edit / Extend
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenEdit(p)}
                        className="fin-badge fin-badge--neutral cursor-pointer hover:opacity-90 flex items-center gap-1"
                        title="View commitment details"
                      >
                        <Eye size={11} /> Details
                      </button>
                    </div>
                  ) : (
                    <span className="fin-cell-subtext text-success font-medium">
                      ✓ {labels.paidOn} {p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} promises
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={effectivePage === 0}
              onClick={onPrevPage}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs">
              Page {effectivePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={onNextPage}
              className="fin-btn fin-btn-secondary py-1 px-3 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

