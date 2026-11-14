'use client';
import SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/components/SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState';
/** Responsibility: Superadmin Finance Subscriptions Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/hooks/useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';
import { formatDate, formatMajorUnitPreviewCurrency, formatRelativeSubscriptionDays } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsFormatters';
import { Eye } from 'lucide-react';
import { SUPERADMIN_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/mocks/fixtures/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionMockFixtures';
import { getSuperadminFinanceSubscriptionPlanOptions } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionUtilities';
import { SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS, SUPERADMIN_FINANCE_SUBSCRIPTIONS_PAGE_CLIENT_STATUS_BADGE } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/constants/SuperadminSubscriptionsOverviewMemberSubscriptionsStaticConstants';



function daysLeftBadgeClass(days: number) {
  if (days < 0) return 'fin-badge fin-badge--danger';
  if (days <= SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS.URGENT) return 'fin-badge fin-badge--danger';
  if (days <= SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS.WARNING) return 'fin-badge fin-badge--warning';
  return 'fin-badge fin-badge--success';
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient`.
 * Owns local UI state for `statusFilter`, `planFilter`, `shiftFilter`.
 */
export default function SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter('subscriptionStatus', 'all');
  const [planFilter, setPlanFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter('plan', 'all');
  const [shiftFilter, setShiftFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter('shift', 'all');
  const plans = useMemo(() => getSuperadminFinanceSubscriptionPlanOptions(SUPERADMIN_FINANCE_SAMPLE_SUBSCRIPTIONS), []);

  const rows = useMemo(
    () => SUPERADMIN_FINANCE_SAMPLE_SUBSCRIPTIONS.filter((subscription) => {
      const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
      const matchesPlan = planFilter === 'all' || subscription.plan === planFilter;
      const matchesShift = shiftFilter === 'all' || subscription.shift === shiftFilter;
      return matchesStatus && matchesPlan && matchesShift;
    }),
    [statusFilter, planFilter, shiftFilter],
  );

  return (
    <div className="space-y-6">
      {(rows?.length === 0) && <SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState filtered />}

      <div>
        <h1 className="fin-page-title">{tCopy("COPY.SUBSCRIPTIONS_SAMPLE")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.ILLUSTRATIVE_SUBSCRIPTION_SNAPSHOT_DATED_14_OCT_2026_DAY_COUNTS_AR_BA16594D")}</p>
      </div>
      <p className="rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.RENEWAL_IS_UNAVAILABLE_BECAUSE_THE_SAMPLE_RECORDS_DO_NOT_SUPPLY_A__008DD4CE")}</p>

      <div className="fin-filter-bar">
        <select aria-label={tCopy("COPY.STATUS_FILTER")} className="fin-select w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} data-testid="superadmin-finance-finance-subscriptions-status-filter-1">
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="active">{tCopy("COPY.ACTIVE")}</option>
          <option value="expired">{tCopy("COPY.EXPIRED")}</option>
          <option value="suspended">{tCopy("COPY.SUSPENDED")}</option>
          <option value="cancelled">{tCopy("COPY.CANCELLED")}</option>
        </select>
        <select aria-label={tCopy("COPY.PLAN_FILTER")} className="fin-select w-40" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} data-testid="superadmin-finance-finance-subscriptions-plan-filter-2">
          <option value="all">{tCopy("COPY.ALL_PLANS")}</option>
          {plans.map(plan => <option key={plan} value={plan}>{plan}</option>)}
        </select>
        <select aria-label={tCopy("COPY.SHIFT_FILTER")} className="fin-select w-40" value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)} data-testid="superadmin-finance-finance-subscriptions-shift-filter-3">
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Evening">{tCopy("COPY.EVENING")}</option>
          <option value="Full Day">{tCopy("COPY.FULL_DAY")}</option>
        </select>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: tCopy('COPY.BASE'), value: rows.reduce((sum, row) => sum + row.base, 0) },
          { label: tCopy('COPY.DISCOUNT'), value: rows.reduce((sum, row) => sum + row.discount, 0) },
          { label: tCopy('COPY.TOTAL_2'), value: rows.reduce((sum, row) => sum + row.total, 0) },
          { label: tCopy('COPY.PAID_2'), value: rows.reduce((sum, row) => sum + row.paid, 0) },
          { label: tCopy('COPY.DUE'), value: rows.reduce((sum, row) => sum + row.due, 0) },
        ].map((summary) => (
          <div key={summary.label} className="fin-kpi-card">
            <p className="fin-kpi-label">{summary.label}</p>
            <p className="fin-kpi-value">{formatMajorUnitPreviewCurrency(summary.value, 'INR', locale)}</p>
          </div>
        ))}
      </div>
      <div className="fin-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="fin-table-header-row">
              <th className="text-left py-3 px-4">{tCopy("COPY.STUDENT")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.SMART_ID_2")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.PLAN")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.START_DATE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.END_DATE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.DAYS_LEFT")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.BASE")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DISCOUNT")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.TOTAL_2")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.PAID_2")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.DUE")}</th>
              <th className="text-left py-3 px-4">{tCopy("COPY.STATUS")}</th>
              <th className="text-right py-3 px-4">{tCopy("COPY.ACTIONS")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={13}>
                  <div className="fin-empty-state">
                    <div className="fin-empty-state__icon">📋</div>
                    <p className="fin-empty-state__title">{tCopy("COPY.NO_SUBSCRIPTIONS_FOUND")}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="fin-table-hover-row fin-table-row">
                  <td className="py-3 px-4 fin-cell-name">{s.studentName}</td>
                  <td className="py-3 px-4 fin-mono">{s.smartId}</td>
                  <td className="py-3 px-4 fin-text-body">{s.plan}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.startDate, locale) || tCopy('COPY.UNKNOWN')}</td>
                  <td className="py-3 px-4 fin-cell-subtext">{formatDate(s.endDate, locale) || tCopy('COPY.UNKNOWN')}</td>
                  <td className="py-3 px-4">
                    <span className={daysLeftBadgeClass(s.daysLeft)}>
                      {formatRelativeSubscriptionDays(s.daysLeft, locale)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4 text-right fin-text-success">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4 text-right font-semibold fin-text-body">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className="py-3 px-4 text-right fin-text-success">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${s.due > 0 ? 'fin-text-danger' : 'fin-text-body'}`}>
                    {tCopy('COPY.FINANCIAL_DETAIL_ONLY')}
                  </td>
                  <td className="py-3 px-4">
                    <span className={SUPERADMIN_FINANCE_SUBSCRIPTIONS_PAGE_CLIENT_STATUS_BADGE[s.status] || 'fin-badge fin-badge--neutral'}>{s.status === 'active' ? tCopy('COPY.ACTIVE') : s.status === 'expired' ? tCopy('COPY.EXPIRED') : s.status === 'suspended' ? tCopy('COPY.SUSPENDED') : tCopy('COPY.CANCELLED')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button"
                        disabled
                        aria-label={tCopy("COPY.SAMPLE_SUBSCRIPTION_RENEWAL_UNAVAILABLE_ARIA_LABEL", { id: s.id })}
                        title={tCopy("COPY.UNAVAILABLE_THIS_SAMPLE_ROW_S_NUMERIC_SUBSCRIPTION_ID_IS_NOT_A_VER_DF48664C")}
                        className="fin-badge fin-badge--neutral opacity-60 cursor-not-allowed"
                       data-testid={`superadmin-finance-finance-subscriptions-sample-subscription-renewal-unavailable-aria-label-4-${String(s.id)}`}>
                        {tCopy("COPY.RENEWAL_UNAVAILABLE")}</button>
                      <button type="button" disabled title={tCopy("COPY.UNAVAILABLE_NO_SUBSCRIPTION_DETAIL_ROUTE_DATA_CONTRACT_IS_SUPPLIED")} className="fin-badge fin-badge--neutral opacity-60 cursor-not-allowed" data-testid={`superadmin-finance-finance-subscriptions-unavailable-no-subscription-detail-route-data-contract-is-supplied-5-${String(s.id)}`}>
                        <Eye size={11} /> {tCopy("COPY.VIEW_UNAVAILABLE")}</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
