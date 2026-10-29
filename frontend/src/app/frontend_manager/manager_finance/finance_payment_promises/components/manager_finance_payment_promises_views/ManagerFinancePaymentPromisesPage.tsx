'use client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useManagerPaymentPromisesFormatting } from '@/app/frontend_manager/manager_finance/finance_payment_promises/hooks/ManagerFinancePaymentPromisesFormattingHook';

// RESPONSIBILITY: Entry page for the manager_payment_promises module.
// DATA FLOW: Next.js Router -> Page -> Components

// RESPONSIBILITY: Entry page for the manager_payment_promises module.
// DATA FLOW: Next.js Router -> Page -> Components

import { CheckCircle, CalendarPlus, Eye } from 'lucide-react';
import { MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES, type ManagerFinancePaymentPromisesPaymentPromiseSample } from '@/app/frontend_manager/manager_finance/finance_payment_promises/mocks/manager_finance_payment_promises_fixtures/ManagerFinancePaymentPromisesPaymentPromiseSampleFixtures';

import { MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE } from '@/app/frontend_manager/manager_finance/finance_payment_promises/constants/ManagerFinancePaymentPromisesPaymentPromiseConstants';
import { ManagerFinancePaymentPromisesEmptyState } from '@/app/frontend_manager/manager_finance/finance_payment_promises/components/manager_finance_payment_promises_empty_states/ManagerFinancePaymentPromisesEmptyState';
import type { ManagerFinancePaymentPromisesRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesComponentTypes';

export default function ManagerFinancePaymentPromisesPage(_routeQuery: ManagerFinancePaymentPromisesRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_payment_promises.ui');
  const { formatCurrency, formatDate } = useManagerPaymentPromisesFormatting();
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const promises: ManagerFinancePaymentPromisesPaymentPromiseSample[] = MANAGER_FINANCE_PAYMENT_PROMISE_SAMPLE_FIXTURES;

  const filtered = promises.filter((p) => statusFilter === 'all' || p.status === statusFilter);

  const totalRows = filtered.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = filtered.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div>
        <h1 className="fin-page-title">{tManagerUi('payment_promises')}</h1><p className="fin-input-hint fin-text-warning" role="status">{tManagerUi('sample_records_are_shown_for_review_mark_paid_and_extend_a732a3')}</p>
        <p className="fin-page-subtitle">{tManagerUi('track_and_manage_student_payment_commitments')}</p>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="fulfilled">{tManagerUi('fulfilled')}</option>
          <option value="overdue">{tManagerUi('overdue')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('promised_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('expected_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('days_until_since_due')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('times_changed')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <ManagerFinancePaymentPromisesEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">🤝</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_payment_promises_recorded')}</p>
                  </ManagerFinancePaymentPromisesEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((p) => (
                <tr key={p.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{p.studentName}</div>
                    <div className="fin-cell-subtext">{p.smartId}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{formatCurrency(p.promisedAmount)}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(p.expectedDate)}</td>
                  <td className="py-3 px-4">
                    <span className={p.daysUntilDue < 0 ? 'fin-text-danger font-semibold' : p.daysUntilDue <= 3 ? 'fin-text-warning' : 'fin-text-body'}>
                      {p.daysUntilDue < 0
                        ? tManagerUi('days_overdue_count', { count: Math.abs(p.daysUntilDue) })
                        : tManagerUi('days_count', { count: p.daysUntilDue })}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.timesChanged >= 3 ? (
                      <span className="fin-badge fin-badge--danger">{p.timesChanged}{tManagerUi('x_changed')}</span>
                    ) : p.timesChanged > 0 ? (
                      <span className="fin-badge fin-badge--warning">{p.timesChanged}{tManagerUi('x_changed')}</span>
                    ) : (
                      <span className="fin-text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={MANAGER_FINANCE_PAYMENT_PROMISE_STATUS_BADGE[p.status] || 'fin-badge fin-badge--neutral'}>{tManagerUi(p.status)}</span>
                  </td>
                  <td className="py-3 px-4">
                    {p.status !== 'fulfilled' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          className="fin-badge fin-badge--success cursor-not-allowed"
                          disabled data-testid="manager-finance-payment-promise-mark-paid-disabled" title={tManagerUi('mark_paid_unavailable_verified_api_contract_not_supplied')}
                        >
                          <CheckCircle size={11} /> {tManagerUi('mark_paid')}
                        </button>
                        <button
                          type="button"
                          className="fin-badge fin-badge--warning cursor-not-allowed"
                          disabled data-testid="manager-finance-payment-promise-extend-disabled" title={tManagerUi('extend_date_unavailable_verified_api_contract_not_suppli_5bf7b2')}
                        >
                          <CalendarPlus size={11} /> {tManagerUi('extend_date')}
                        </button>
                        <button type="button" disabled title={tManagerUi('detail_route_is_outside_the_supplied_frontend_contract')} className="fin-badge fin-badge--neutral">
                          <Eye size={11} /> {tManagerUi('view')}
                        </button>
                      </div>
                    ) : (
                      <span className="fin-cell-subtext">{tManagerUi('paid_on')} {p.fulfilledDate ? formatDate(p.fulfilledDate) : '—'}</span>
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
              Showing {startItem}–{endItem} of {totalRows} results
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-finance-payment-promises" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-finance-payment-promises"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(0);
                  }}
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
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
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
                  onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
