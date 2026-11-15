'use client';

import React from 'react';
import { CheckCircle, Edit3, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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
  const renderSortIndicator = (field: PromiseSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="opacity-40 text-secondary" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={12} className="text-primary font-bold" />
    ) : (
      <ArrowDown size={12} className="text-primary font-bold" />
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left border-collapse" role="table">
          <thead>
            <tr className="border-b border-border bg-muted text-xs font-semibold text-secondary">
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none"
                onClick={() => onToggleSort('studentName')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.student}</span>
                  {renderSortIndicator('studentName')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none text-right"
                onClick={() => onToggleSort('promisedAmount')}
                role="columnheader"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{labels.promisedInr}</span>
                  {renderSortIndicator('promisedAmount')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none"
                onClick={() => onToggleSort('expectedDate')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.expectedDate}</span>
                  {renderSortIndicator('expectedDate')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none"
                onClick={() => onToggleSort('daysUntilDue')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.daysUntilSinceDue}</span>
                  {renderSortIndicator('daysUntilDue')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none"
                onClick={() => onToggleSort('timesChanged')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.timesChanged}</span>
                  {renderSortIndicator('timesChanged')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary transition-colors select-none"
                onClick={() => onToggleSort('status')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.status}</span>
                  {renderSortIndicator('status')}
                </div>
              </th>
              <th className="py-3 px-4 text-right" role="columnheader">{labels.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-0">
                  <ManagerFinancePaymentPromisesEmptyState>
                    {labels.noPromises}
                  </ManagerFinancePaymentPromisesEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-primary">{p.studentName}</div>
                    <div className="text-[11px] font-mono text-secondary">{p.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-primary">
                    {formatCurrency(p.promisedAmount)}
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary">
                    {formatDate(p.expectedDate)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        p.daysUntilDue < 0
                          ? 'font-bold text-danger'
                          : p.daysUntilDue <= 2
                          ? 'font-semibold text-warning-text'
                          : 'text-secondary'
                      }
                    >
                      {p.daysUntilDue === 0
                        ? 'Due Today'
                        : p.daysUntilDue < 0
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
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="Mark payment promise as cleared"
                        >
                          <CheckCircle size={11} /> Mark Paid
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEdit(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="Edit promise amount or expected date"
                        >
                          <Edit3 size={11} /> Edit
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="fin-cell-subtext text-success font-medium">
                          ✓ {labels.paidOn} {p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs sm:text-sm text-secondary">
          <span>
            Showing {startItem}–{endItem} of {totalRows} promises
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={effectivePage === 0}
              onClick={onPrevPage}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              Previous
            </button>
            <span className="text-xs px-1">
              Page {effectivePage + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={effectivePage >= pageCount - 1}
              onClick={onNextPage}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-secondary hover:text-primary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
