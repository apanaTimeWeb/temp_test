'use client';
import { useTranslations } from 'next-intl';
import { useManagerRefundsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_refunds/hooks/useManagerFinanceRefundsUrlFilters';

import { useManagerRefundsFormatting } from '@/app/frontend_manager/manager_finance/finance_refunds/hooks/ManagerFinanceRefundsFormattingHook';
import { useMemo, useState } from 'react';
import { useManagerFinanceRefunds } from '@/app/frontend_manager/manager_finance/finance_refunds/hooks/useManagerFinanceRefundsRefunds';
import type { ManagerFinanceRefundsRefund } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsTypes';
import { ManagerFinanceRefundsEmptyState } from '@/app/frontend_manager/manager_finance/finance_refunds/components/manager_finance_refunds_empty_states/ManagerFinanceRefundsEmptyState';
import type { ManagerFinanceRefundsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsComponentTypes';

// RESPONSIBILITY: Render the manager finance finance refunds feature view and preserve route query context.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.

const URL_FILTERS = { status: { defaultValue: 'all', allowedValues: ['all', 'pending', 'approved', 'processed', 'rejected'] } } as const;

const STATUS_BADGE: Record<ManagerFinanceRefundsRefund['status'], string> = { pending: 'fin-badge fin-badge--warning', approved: 'fin-badge fin-badge--success', rejected: 'fin-badge fin-badge--danger', processed: 'fin-badge fin-badge--info', unknown: 'fin-badge fin-badge--neutral' };

export default function ManagerFinanceRefundsPage(_routeQuery: ManagerFinanceRefundsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_refunds.ui');
  const { formatCurrency } = useManagerRefundsFormatting();
  const refundsQuery = useManagerFinanceRefunds();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerRefundsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status as 'all' | ManagerFinanceRefundsRefund['status'];
  const refunds = refundsQuery.data ?? [];
  const filtered = useMemo(() => refunds.filter((refund) => statusFilter === 'all' || refund.status === statusFilter), [refunds, statusFilter]);
  const processedRefunds = refunds.filter((refund) => refund.status === 'processed');
  const processedCurrency = processedRefunds[0]?.currency;
  const processedTotalIsKnown = processedRefunds.length > 0 && Boolean(processedCurrency) && processedRefunds.every((refund) => refund.currency === processedCurrency && typeof refund.netRefund === 'number');
  const processedTotal = processedTotalIsKnown ? processedRefunds.reduce((sum, refund) => sum + (refund.netRefund as number), 0) : undefined;

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

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
        <h1 className="fin-page-title">{tManagerUi('refunds')}</h1>
        <p className="fin-page-subtitle">{tManagerUi('review_student_deposit_refund_requests')}</p>
        <p className="fin-input-hint fin-text-warning" data-testid="manager-finance-refunds-contract-warning" role="status">{tManagerUi('read_only_view_processing_refunds_and_changing_deduction_ea1d8e')}</p>
        <p className="fin-input-hint fin-text-warning" role="status" data-testid="manager-finance-refund-fields-warning">{tManagerUi('finance_fields_not_inferred')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tManagerUi('total_refunded')}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--success">{refundsQuery.isPending || processedTotal === undefined || !processedCurrency ? '—' : formatCurrency(processedTotal, processedCurrency)}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tManagerUi('pending_96f608')}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--warning">{refundsQuery.isPending ? '—' : refunds.filter((r) => r.status === 'pending').length}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tManagerUi('approved')}</p>
          <p className="fin-stat-mini__value">{refundsQuery.isPending ? '—' : refunds.filter((r) => r.status === 'approved').length}</p>
        </div>
        <div className="fin-stat-mini">
          <p className="fin-stat-mini__label">{tManagerUi('rejected')}</p>
          <p className="fin-stat-mini__value fin-stat-mini__value--danger">{refundsQuery.isPending ? '—' : refunds.filter((r) => r.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="fin-filter-bar">
        <label className="sr-only" htmlFor="refund-status">{tManagerUi('refund_status')}</label>
        <select id="refund-status" className="fin-select w-40" value={statusFilter} onChange={(event) => { setUrlFilter('status', event.target.value); setPage(0); }}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="pending">{tManagerUi('pending_96f608')}</option>
          <option value="approved">{tManagerUi('approved')}</option>
          <option value="processed">{tManagerUi('processed')}</option>
          <option value="rejected">{tManagerUi('rejected')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('exit_date')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('deposit_held_0eabdd')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('deduction')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('net_refund')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {refundsQuery.isPending ? (
              Array.from({ length: 5 }, (_, index) => (
                <tr key={`refund-skeleton-row-${index}`} className="fin-table-row">
                  {Array.from({ length: 7 }, (_, cell) => (
                    <td key={`refund-skeleton-cell-${cell}`} className="py-3 px-4"><div className="fin-skeleton h-4 w-16" /></td>
                  ))}
                </tr>
              ))
            ) : refundsQuery.isError ? (
              <tr>
                <td colSpan={7}>
                  <div className="fin-empty-state">
                    <p className="fin-empty-state__title">{tManagerUi('unable_to_load_refunds')}</p>
                    <button type="button" className="fin-badge fin-badge--neutral cursor-pointer" onClick={() => refundsQuery.refetch()}>{tManagerUi('retry')}</button>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <ManagerFinanceRefundsEmptyState className="fin-empty-state">
                    <p className="fin-empty-state__title">{tManagerUi('no_refunds_found')}</p>
                  </ManagerFinanceRefundsEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((refund) => (
                <tr key={refund.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                  <td className="py-3 px-4">
                    <div className="fin-cell-name">{refund.studentName}</div>
                    <div className="fin-cell-subtext">{refund.smartId}</div>
                  </td>
                  <td className="py-3 px-4 fin-cell-subtext">{refund.exitDate ?? '—'}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{refund.currency && typeof refund.depositHeld === 'number' ? formatCurrency(refund.depositHeld, refund.currency) : '—'}</td>
                  <td className="py-3 px-4 text-right">
                    {typeof refund.deductionAmount !== 'number' || !refund.currency ? (
                      <span className="fin-text-muted">—</span>
                    ) : refund.deductionAmount > 0 ? (
                      <span className="fin-text-danger">-{formatCurrency(refund.deductionAmount, refund.currency)}</span>
                    ) : (
                      <span className="fin-text-muted">{tManagerUi('none')}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-success">{refund.currency && typeof refund.netRefund === 'number' ? formatCurrency(refund.netRefund, refund.currency) : '—'}</td>
                  <td className="py-3 px-4">
                    <span className={STATUS_BADGE[refund.status]}>{refund.status === 'unknown' ? tManagerUi('unknown_status') : tManagerUi(refund.status)}</span>
                    {refund.rejectionReason && <div className="fin-cell-subtext mt-1 max-w-32 truncate">{refund.rejectionReason}</div>}
                    {refund.processedDate && <div className="fin-cell-subtext mt-1">{refund.processedDate} · {refund.paymentMethod}</div>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {(refund.status === 'pending' || refund.status === 'approved') && (
                        <button
                          type="button"
                          className="fin-badge fin-badge--success cursor-not-allowed"
                          data-testid={`manager-finance-refund-process-disabled-${refund.id}`}
                          disabled
                          title={tManagerUi('refund_processing_unavailable_verified_api_contract_not_119768')}
                        >
                          {tManagerUi('process_unavailable')}
                        </button>
                      )}
                      {refund.status === 'pending' && (
                        <button
                          type="button"
                          className="fin-badge fin-badge--warning cursor-not-allowed"
                          data-testid={`manager-finance-refund-deduction-disabled-${refund.id}`}
                          disabled
                          title={tManagerUi('deduction_updates_unavailable_verified_api_contract_not_a1bd15')}
                        >
                          {tManagerUi('add_deduction_unavailable')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && !refundsQuery.isPending && !refundsQuery.isError && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-secondary">
            <span>
              Showing {startItem}–{endItem} of {totalRows} results
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <label htmlFor="rows-per-page-finance-refunds" className="text-xs text-secondary whitespace-nowrap">
                  Rows per page:
                </label>
                <select
                  id="rows-per-page-finance-refunds"
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
