'use client';
import { useTranslations } from 'next-intl';
import { MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsDemoRepository';
import { useManagerSubscriptionsUrlFilters } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/useManagerFinanceSubscriptionsUrlFilters';

import { useManagerSubscriptionsFormatting } from '@/app/frontend_manager/manager_finance/finance_subscriptions/hooks/ManagerFinanceSubscriptionsFormattingHook';

// RESPONSIBILITY: Entry page for the manager_subscriptions module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useEffect } from 'react';

import { Download, Upload, Printer, MessageSquare, Send, Mail, RefreshCw, Eye } from 'lucide-react';
import { ManagerFinanceSubscriptionsEmptyState } from '@/app/frontend_manager/manager_finance/finance_subscriptions/components/manager_finance_subscriptions_empty_states/ManagerFinanceSubscriptionsEmptyState';
import type { ManagerFinanceSubscriptionsRouteQueryProps } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsComponentTypes';

const URL_FILTERS = {
  status: { defaultValue: 'all', allowedValues: ['all', 'active', 'expired', 'suspended', 'cancelled'] },
  plan: { defaultValue: 'all', allowedValues: ['all', 'Basic Plan', 'Premium Plan'] },
  shift: { defaultValue: 'all', allowedValues: ['all', 'Morning', 'Evening', 'Full Day'] },
} as const;

const STATUS_BADGE: Record<string, string> = {
  active:    'fin-badge fin-badge--success',
  expired:   'fin-badge fin-badge--danger',
  suspended: 'fin-badge fin-badge--warning',
  cancelled: 'fin-badge fin-badge--neutral',
};

function daysLeftBadgeClass(days: number) {
  if (days < 0) return 'fin-badge fin-badge--danger';
  if (days <= 7) return 'fin-badge fin-badge--danger';
  if (days <= 15) return 'fin-badge fin-badge--warning';
  return 'fin-badge fin-badge--success';
}

export default function ManagerFinanceSubscriptionsPage(_routeQuery: ManagerFinanceSubscriptionsRouteQueryProps) {
  const tManagerUi = useTranslations('manager.manager_subscriptions.ui');
  const displayPlan = (value: string) => ({ 'Basic Plan': tManagerUi('basic_plan'), 'Premium Plan': tManagerUi('premium_plan') } as Record<string, string>)[value] ?? value;
  const { formatCurrency, formatDate } = useManagerSubscriptionsFormatting();
  const { values: urlFilters, setValue: setUrlFilter } = useManagerSubscriptionsUrlFilters(URL_FILTERS);
  const statusFilter = urlFilters.status;
  const planFilter = urlFilters.plan;
  const shiftFilter = urlFilters.shift;
  const [rows, setRows] = useState(MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Dependency rationale: derive visible subscription rows from the three active filter values.
  useEffect(() => {
    setRows(
      MANAGER_FINANCE_SAMPLE_SUBSCRIPTIONS.filter((s) => {
        const st = statusFilter === 'all' || s.status === statusFilter;
        const pl = planFilter === 'all' || s.plan === planFilter;
        const sh = shiftFilter === 'all' || s.shift === shiftFilter;
        return st && pl && sh;
      })
    );
    setPage(0);
  }, [statusFilter, planFilter, shiftFilter]);

  const totalRows = rows.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize));
  const effectivePage = Math.min(page, pageCount - 1);
  const paginated = rows.slice(effectivePage * pageSize, (effectivePage + 1) * pageSize);
  const startItem = totalRows === 0 ? 0 : effectivePage * pageSize + 1;
  const endItem = Math.min((effectivePage + 1) * pageSize, totalRows);

  return (
    <div className="space-y-6"
      data-route-view={_routeQuery.view}
      data-route-id={_routeQuery.id}
      data-route-name={_routeQuery.name}
      data-route-phone={_routeQuery.phone}
      data-route-smart-id={_routeQuery.smartId}>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="fin-page-title">{tManagerUi('subscriptions')}</h1>
          <p className="fin-page-subtitle">{tManagerUi('manage_all_student_subscriptions')}</p>
          <p className="fin-input-hint fin-text-warning mt-2" data-testid="manager-finance-subscriptions-sample-warning" role="status">{tManagerUi('subscription_rows_and_amounts_are_illustrative_sample_da_4b9c16')}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="fin-btn fin-btn-secondary" disabled title={tManagerUi('import_is_disabled_because_the_supplied_frontend_contrac_0dd58d')}>
            <Upload size={14} /> {tManagerUi('import')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary" disabled title={tManagerUi('csv_export_is_disabled_because_all_displayed_subscriptio_5a9505')}>
            <Download size={14} /> {tManagerUi('csv_unavailable')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary" disabled title={tManagerUi('official_printing_is_unavailable_because_subscription_re_b0eb16')}>
            <Printer size={14} /> {tManagerUi('print_unavailable')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-success" disabled title={tManagerUi('whatsapp_sending_requires_a_supplied_contact_integration_c618bf')}>
            <MessageSquare size={14} /> {tManagerUi('whatsapp')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-info" disabled title={tManagerUi('telegram_sending_requires_a_supplied_contact_integration_9d73ab')}>
            <Send size={14} /> {tManagerUi('telegram')}
          </button>
          <button type="button" className="fin-btn fin-btn-secondary text-purple" disabled title={tManagerUi('email_sending_requires_a_supplied_contact_integration_co_68e954')}>
            <Mail size={14} /> {tManagerUi('email')}
          </button>
        </div>
      </div>

      <div className="fin-filter-bar">
        <select className="fin-select w-40" value={statusFilter} onChange={(e) => setUrlFilter('status', e.target.value)} aria-label={tManagerUi('all_status')}>
          <option value="all">{tManagerUi('all_status')}</option>
          <option value="active">{tManagerUi('active')}</option>
          <option value="expired">{tManagerUi('expired')}</option>
          <option value="suspended">{tManagerUi('suspended')}</option>
          <option value="cancelled">{tManagerUi('cancelled')}</option>
        </select>
        <select className="fin-select w-40" value={planFilter} onChange={(e) => setUrlFilter('plan', e.target.value)} aria-label={tManagerUi('all_plans')}>
          <option value="all">{tManagerUi('all_plans')}</option>
          <option value="Basic Plan">{tManagerUi('basic_plan')}</option>
          <option value="Premium Plan">{tManagerUi('premium_plan')}</option>
        </select>
        <select className="fin-select w-40" value={shiftFilter} onChange={(e) => setUrlFilter('shift', e.target.value)} aria-label={tManagerUi('all_shifts')}>
          <option value="all">{tManagerUi('all_shifts')}</option>
          <option value="Morning">{tManagerUi('morning')}</option>
          <option value="Evening">{tManagerUi('evening')}</option>
          <option value="Full Day">{tManagerUi('full_day')}</option>
        </select>
      </div>

      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row bg-surface-highlight text-xs uppercase text-secondary font-semibold">
              <th className="text-left py-3 px-4">{tManagerUi('student')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('smart_id')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('plan')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('start_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('end_date')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('days_left')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('base_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('discount_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('total_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('paid_inr')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('due_inr')}</th>
              <th className="text-left py-3 px-4">{tManagerUi('status')}</th>
              <th className="text-right py-3 px-4">{tManagerUi('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <ManagerFinanceSubscriptionsEmptyState className="fin-empty-state">
                    <div className="fin-empty-state__icon">📋</div>
                    <p className="fin-empty-state__title">{tManagerUi('no_subscriptions_found')}</p>
                  </ManagerFinanceSubscriptionsEmptyState>
                </td>
              </tr>
            ) : (
              paginated.map((s) => (
                <tr key={s.id} className="fin-table-hover-row fin-table-row border-b border-border last:border-0 hover:bg-surface-hover even:bg-surface-zebra/30 h-12">
                  <td className="py-3 px-4 fin-cell-name">{s.studentName}</td>
                  <td className="py-3 px-4 fin-mono">{s.smartId}</td>
                  <td className="py-3 px-4 fin-text-body">{displayPlan(s.plan)}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.startDate)}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.endDate)}</td>
                  <td className="py-3 px-4">
                    <span className={daysLeftBadgeClass(s.daysLeft)}>
                      {s.daysLeft < 0 ? tManagerUi('days_ago_count', { count: Math.abs(s.daysLeft) }) : tManagerUi('days_count', { count: s.daysLeft })}
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
                    <span className={STATUS_BADGE[s.status] || 'fin-badge fin-badge--neutral'}>{tManagerUi(s.status)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="fin-badge fin-badge--neutral cursor-not-allowed"
                        disabled
                        title={tManagerUi('renewal_unavailable_this_is_a_sample_subscription_withou_4070ba')}
                      >
                        <RefreshCw size={11} /> {tManagerUi('renewal_unavailable')}
                      </button>
                      <button
                        type="button"
                        className="fin-badge fin-badge--neutral"
                        disabled
                        title={tManagerUi('subscription_detail_cannot_be_opened_until_a_canonical_s_b2e389')}
                      >
                        <Eye size={11} /> {tManagerUi('view')}
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
