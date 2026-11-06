'use client';

import React from 'react';
import { Eye, RefreshCw, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { ManagerFinanceSubscriptionsEmptyState } from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_empty_states/ManagerFinanceSubscriptionsEmptyState';

const STATUS_BADGE: Record<string, string> = {
  active: 'fin-badge fin-badge--success',
  expired: 'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

function daysLeftBadgeClass(days: number) {
  if (days < 0) return 'fin-badge fin-badge--danger';
  if (days <= 7) return 'fin-badge fin-badge--danger';
  if (days <= 15) return 'fin-badge fin-badge--warning';
  return 'fin-badge fin-badge--success';
}

export type SubSortField = 'studentName' | 'smartId' | 'plan' | 'startDate' | 'endDate' | 'daysLeft' | 'total' | 'due' | 'status';

export interface ManagerFinanceSubscriptionsTableProps {
  filteredRows: typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS;
  paginated: typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS;
  searchQuery: string;
  totalRows: number;
  startItem: number;
  endItem: number;
  pageSize: number;
  effectivePage: number;
  pageCount: number;
  sortField: SubSortField | null;
  sortDirection: 'asc' | 'desc';
  onToggleSort: (field: SubSortField) => void;
  onPageSizeChange: (size: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  onSelectSubscription: (sub: (typeof MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS)[0]) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  displayPlan: (val: string) => string;
  labels: {
    student: string;
    smartId: string;
    plan: string;
    startDate: string;
    endDate: string;
    daysLeft: string;
    baseInr: string;
    discountInr: string;
    totalInr: string;
    paidInr: string;
    dueInr: string;
    status: string;
    actions: string;
    noSubscriptions: string;
    renewalUnavailable: string;
    renewalUnavailableHint: string;
    view: string;
    daysAgoCount: (count: number) => string;
    daysCount: (count: number) => string;
    translateStatus: (s: string) => string;
  };
}

export default function ManagerFinanceSubscriptionsTable({
  filteredRows,
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
  onSelectSubscription,
  formatCurrency,
  formatDate,
  displayPlan,
  labels,
}: ManagerFinanceSubscriptionsTableProps) {
  const renderSortableHeader = (field: SubSortField, label: string, align: 'left' | 'right' = 'left') => {
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
            {renderSortableHeader('studentName', labels.student)}
            {renderSortableHeader('smartId', labels.smartId)}
            {renderSortableHeader('plan', labels.plan)}
            {renderSortableHeader('startDate', labels.startDate)}
            {renderSortableHeader('endDate', labels.endDate)}
            {renderSortableHeader('daysLeft', labels.daysLeft)}
            <th className="text-right py-3 px-4">{labels.baseInr}</th>
            <th className="text-right py-3 px-4">{labels.discountInr}</th>
            {renderSortableHeader('total', labels.totalInr, 'right')}
            <th className="text-right py-3 px-4">{labels.paidInr}</th>
            {renderSortableHeader('due', labels.dueInr, 'right')}
            {renderSortableHeader('status', labels.status)}
            <th className="text-right py-3 px-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={13}>
                <ManagerFinanceSubscriptionsEmptyState className="fin-empty-state">
                  <div className="fin-empty-state__icon">📋</div>
                  <p className="fin-empty-state__title">
                    {searchQuery ? 'No subscriptions matching your search query.' : labels.noSubscriptions}
                  </p>
                </ManagerFinanceSubscriptionsEmptyState>
              </td>
            </tr>
          ) : (
            paginated.map((s) => (
              <tr key={s.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra h-12">
                <td className="py-3 px-4 fin-cell-name">{s.studentName}</td>
                <td className="py-3 px-4 fin-mono">{s.smartId}</td>
                <td className="py-3 px-4 fin-text-body">{displayPlan(s.plan)}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.startDate)}</td>
                <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.endDate)}</td>
                <td className="py-3 px-4">
                  <span className={daysLeftBadgeClass(s.daysLeft)}>
                    {s.daysLeft < 0 ? labels.daysAgoCount(Math.abs(s.daysLeft)) : labels.daysCount(s.daysLeft)}
                  </span>
                </td>
                <td className="py-3 px-4 text-right fin-text-body">{formatCurrency(s.base)}</td>
                <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(s.discount)}</td>
                <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(s.total)}</td>
                <td className="py-3 px-4 text-right fin-text-success">{formatCurrency(s.paid)}</td>
                <td className={`py-3 px-4 text-right font-semibold ${s.due > 0 ? 'fin-text-danger' : 'fin-text-body'}`}>
                  {formatCurrency(s.due)}
                </td>
                <td className="py-3 px-4">
                  <span className={STATUS_BADGE[s.status] || 'fin-badge fin-badge--neutral'}>{labels.translateStatus(s.status)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="fin-badge fin-badge--neutral cursor-not-allowed"
                      disabled
                      title={labels.renewalUnavailableHint}
                    >
                      <RefreshCw size={11} /> {labels.renewalUnavailable}
                    </button>
                    <button
                      type="button"
                      className="fin-badge fin-badge--info cursor-pointer flex items-center gap-1 hover:opacity-90"
                      onClick={() => onSelectSubscription(s)}
                      title="View Subscription Details"
                    >
                      <Eye size={11} /> {labels.view}
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
              <label htmlFor="rows-per-page-finance-subscriptions" className="text-xs text-secondary whitespace-nowrap">
                Rows per page:
              </label>
              <select
                id="rows-per-page-finance-subscriptions"
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
    </div>
  );
}
