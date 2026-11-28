'use client';

import { ManagerFinancePaymentPromisesEmptyState } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_empty_states/ManagerFinancePaymentPromisesEmptyState';
import { ManagerFinancePaymentPromisesPagination } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_views/ManagerFinancePaymentPromisesPagination';
import { MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/constants/ManagerFinancePaymentPromisesPaymentPromiseConstants';
import type { ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesTypes';
import { formatPromiseInr, getPromiseMajorUnits } from '@/app/frontend_manager/manager_finance/finance_payment_promises/utils/ManagerFinancePaymentPromisesHelpers';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle, Edit3, Eye, IndianRupee, MessageCircle, PhoneCall } from 'lucide-react';

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
  onCollectAmount?: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  onWhatsAppPromise?: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  onCallPromise?: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  onOpenEdit: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
  onOpenView: (p: ManagerFinancePaymentPromisesPaymentPromiseSample) => void;
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
  onCollectAmount,
  onWhatsAppPromise,
  onCallPromise,
  onOpenEdit,
  onOpenView,
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
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none"
                onClick={() => onToggleSort('studentName')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.student}</span>
                  {renderSortIndicator('studentName')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none text-right"
                onClick={() => onToggleSort('promisedAmount')}
                role="columnheader"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>{labels.promisedInr}</span>
                  {renderSortIndicator('promisedAmount')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none"
                onClick={() => onToggleSort('expectedDate')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.expectedDate}</span>
                  {renderSortIndicator('expectedDate')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none"
                onClick={() => onToggleSort('daysUntilDue')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.daysUntilSinceDue}</span>
                  {renderSortIndicator('daysUntilDue')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none"
                onClick={() => onToggleSort('timesChanged')}
                role="columnheader"
              >
                <div className="flex items-center gap-1.5">
                  <span>{labels.timesChanged}</span>
                  {renderSortIndicator('timesChanged')}
                </div>
              </th>
              <th
                className="py-3 px-4 cursor-pointer hover:text-primary motion-safe:transition-colors select-none"
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
                <tr key={p.id} className="hover:bg-muted/40 motion-safe:transition-colors">
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
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {onCollectAmount && (
                          <button
                            type="button"
                            data-testid={`collect-amount-btn-${p.id}`}
                            onClick={() => onCollectAmount(p)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-primary text-on-primary hover:opacity-90 shadow-xs motion-safe:transition-opacity cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                            title={`Open Fee Counter pre-filled with ${p.studentName} and ${formatPromiseInr(getPromiseMajorUnits(p.promisedAmount))}`}
                          >
                            <IndianRupee size={11} /> Collect
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onMarkPaid(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="Mark payment promise as cleared"
                        >
                          <CheckCircle size={11} /> Mark Paid
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenEdit(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="Edit promise amount or expected date"
                        >
                          <Edit3 size={11} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenView(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="View commitment details"
                        >
                          <Eye size={11} /> View
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <span className="fin-cell-subtext text-success font-medium">
                          ✓ {labels.paidOn} {p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenView(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-surface-hover text-secondary hover:text-primary motion-safe:transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
                          title="View commitment details"
                        >
                          <Eye size={11} /> View
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ManagerFinancePaymentPromisesPagination
        startItem={startItem}
        endItem={endItem}
        totalRows={totalRows}
        effectivePage={effectivePage}
        pageCount={pageCount}
        onPrevPage={onPrevPage}
        onNextPage={onNextPage}
      />
    </div>
  );
}
