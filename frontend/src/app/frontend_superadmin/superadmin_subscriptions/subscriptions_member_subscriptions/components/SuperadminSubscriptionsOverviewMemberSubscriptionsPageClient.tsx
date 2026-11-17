'use client';
import SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/components/SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState';
/** Responsibility: Superadmin Finance Subscriptions Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route -> SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/hooks/useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter';

import { useTranslations, useLocale } from 'next-intl';
import { useMemo } from 'react';
import { formatDate, formatMajorUnitPreviewCurrency, formatRelativeSubscriptionDays } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsFormatters';
import { Eye, Layers, Filter, CheckCircle, Clock, AlertCircle, RotateCcw } from 'lucide-react';
import { SUPERADMIN_FINANCE_SAMPLE_SUBSCRIPTIONS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/mocks/fixtures/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionMockFixtures';
import { getSuperadminFinanceSubscriptionPlanOptions } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/utils/SuperadminSubscriptionsOverviewMemberSubscriptionsSubscriptionUtilities';
import { SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS } from '@/app/frontend_superadmin/superadmin_subscriptions/subscriptions_member_subscriptions/constants/SuperadminSubscriptionsOverviewMemberSubscriptionsStaticConstants';

function daysLeftBadgeClass(days: number) {
  if (days < 0 || days <= SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS.URGENT) {
    return 'inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-xs font-semibold text-rose-400';
  }
  if (days <= SUPERADMIN_FINANCE_SUBSCRIPTION_DAY_THRESHOLDS.WARNING) {
    return 'inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400';
  }
  return 'inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-400';
}

/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient`.
 * Owns local UI state for `statusFilter`, `planFilter`, `shiftFilter`.
 */
export default function SuperadminSubscriptionsOverviewMemberSubscriptionsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const [statusFilter, setStatusFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter<string>('subscriptionStatus', 'all');
  const [planFilter, setPlanFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter<string>('plan', 'all');
  const [shiftFilter, setShiftFilter] = useSuperadminSubscriptionsOverviewMemberSubscriptionsUrlFilter<string>('shift', 'all');
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

  const resetFilters = () => {
    setStatusFilter('all');
    setPlanFilter('all');
    setShiftFilter('all');
  };

  const hasActiveFilters = statusFilter !== 'all' || planFilter !== 'all' || shiftFilter !== 'all';

  return (
    <div className="w-full max-w-full min-w-0 space-y-6">
      {(rows?.length === 0) && <SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState filtered />}

      {/* Hero Header Card */}
      <div className="rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                  {tCopy("COPY.SUBSCRIPTIONS_SAMPLE")}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Snapshot Active
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
                  {rows.length} Subscriptions
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                {tCopy("COPY.ILLUSTRATIVE_SUBSCRIPTION_SNAPSHOT_DATED_14_OCT_2026_DAY_COUNTS_AR_BA16594D")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 p-4 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter size={14} className="text-indigo-400" />
          <span>Filters:</span>
        </div>
        <select
          aria-label={tCopy("COPY.STATUS_FILTER")}
          className="h-10 rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-100 focus:border-indigo-500 focus:outline-none cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          data-testid="superadmin-finance-finance-subscriptions-status-filter-1"
        >
          <option value="all">{tCopy("COPY.ALL_STATUS")}</option>
          <option value="active">{tCopy("COPY.ACTIVE")}</option>
          <option value="expired">{tCopy("COPY.EXPIRED")}</option>
          <option value="suspended">{tCopy("COPY.SUSPENDED")}</option>
          <option value="cancelled">{tCopy("COPY.CANCELLED")}</option>
        </select>
        <select
          aria-label={tCopy("COPY.PLAN_FILTER")}
          className="h-10 rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-100 focus:border-indigo-500 focus:outline-none cursor-pointer"
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          data-testid="superadmin-finance-finance-subscriptions-plan-filter-2"
        >
          <option value="all">{tCopy("COPY.ALL_PLANS")}</option>
          {plans.map((plan) => (
            <option key={plan} value={plan}>{plan}</option>
          ))}
        </select>
        <select
          aria-label={tCopy("COPY.SHIFT_FILTER")}
          className="h-10 rounded-xl border border-indigo-500/25 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-100 focus:border-indigo-500 focus:outline-none cursor-pointer"
          value={shiftFilter}
          onChange={(e) => setShiftFilter(e.target.value)}
          data-testid="superadmin-finance-finance-subscriptions-shift-filter-3"
        >
          <option value="all">{tCopy("COPY.ALL_SHIFTS")}</option>
          <option value="Morning">{tCopy("COPY.MORNING")}</option>
          <option value="Evening">{tCopy("COPY.EVENING")}</option>
          <option value="Full Day">{tCopy("COPY.FULL_DAY")}</option>
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: tCopy('COPY.BASE'), value: rows.reduce((sum, row) => sum + row.base, 0), theme: 'sky' as const },
          { label: tCopy('COPY.DISCOUNT'), value: rows.reduce((sum, row) => sum + row.discount, 0), theme: 'amber' as const },
          { label: tCopy('COPY.TOTAL_2'), value: rows.reduce((sum, row) => sum + row.total, 0), theme: 'indigo' as const },
          { label: tCopy('COPY.PAID_2'), value: rows.reduce((sum, row) => sum + row.paid, 0), theme: 'emerald' as const },
          { label: tCopy('COPY.DUE'), value: rows.reduce((sum, row) => sum + row.due, 0), theme: 'rose' as const },
        ].map((summary) => {
          const isRose = summary.theme === 'rose';
          const isEmerald = summary.theme === 'emerald';
          const isAmber = summary.theme === 'amber';
          const isSky = summary.theme === 'sky';

          const borderClass = isRose
            ? 'border-rose-500/30 from-rose-950/40'
            : isEmerald
            ? 'border-emerald-500/30 from-emerald-950/40'
            : isAmber
            ? 'border-amber-500/30 from-amber-950/40'
            : isSky
            ? 'border-sky-500/30 from-sky-950/40'
            : 'border-indigo-500/30 from-indigo-950/40';

          const textClass = isRose ? 'text-rose-400' : isEmerald ? 'text-emerald-400' : isAmber ? 'text-amber-400' : isSky ? 'text-sky-400' : 'text-indigo-300';
          const barClass = isRose ? 'from-rose-500 to-pink-500' : isEmerald ? 'from-emerald-500 to-teal-400' : isAmber ? 'from-amber-500 to-yellow-400' : isSky ? 'from-sky-500 to-cyan-400' : 'from-indigo-500 to-indigo-400';

          return (
            <div key={summary.label} className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br via-slate-900/90 to-slate-900/90 p-4 shadow-lg ${borderClass}`}>
              <span className={`text-xs font-semibold uppercase tracking-wider ${textClass}`}>{summary.label}</span>
              <p className="mt-2 text-xl sm:text-2xl font-black text-slate-100">
                {formatMajorUnitPreviewCurrency(summary.value, 'INR', locale)}
              </p>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full bg-gradient-to-r ${barClass}`} style={{ width: '70%' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-indigo-500/20 bg-[#0c0f28]/95 shadow-md backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wider text-slate-300">
              <tr>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.STUDENT")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.SMART_ID_2")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.PLAN")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.START_DATE")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.END_DATE")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.DAYS_LEFT")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.BASE")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.DISCOUNT")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.TOTAL_2")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.PAID_2")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.DUE")}</th>
                <th className="py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.STATUS")}</th>
                <th className="text-right py-3 px-4 border-b border-indigo-500/20">{tCopy("COPY.ACTIONS")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-500/10">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    <SuperadminSubscriptionsOverviewMemberSubscriptionsEmptyState filtered />
                  </td>
                </tr>
              ) : (
                rows.map((s) => {
                  const isPaid = s.status === 'active';
                  const isExpired = s.status === 'expired';
                  const isSuspended = s.status === 'suspended';

                  return (
                    <tr key={s.id} className="transition-colors hover:bg-indigo-500/[0.04]">
                      <td className="py-3.5 px-4 font-semibold text-slate-100">{s.studentName}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-indigo-400/80">{s.smartId}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                          {s.plan}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{formatDate(s.startDate, locale) || tCopy('COPY.UNKNOWN')}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">{formatDate(s.endDate, locale) || tCopy('COPY.UNKNOWN')}</td>
                      <td className="py-3.5 px-4">
                        <span className={daysLeftBadgeClass(s.daysLeft)}>
                          {formatRelativeSubscriptionDays(s.daysLeft, locale)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right text-xs text-slate-300 font-mono">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                      <td className="py-3.5 px-4 text-right text-xs text-emerald-400 font-mono">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                      <td className="py-3.5 px-4 text-right text-xs font-bold text-slate-100 font-mono">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                      <td className="py-3.5 px-4 text-right text-xs font-bold text-emerald-400 font-mono">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</td>
                      <td className={`py-3.5 px-4 text-right text-xs font-bold font-mono ${s.due > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                        {tCopy('COPY.FINANCIAL_DETAIL_ONLY')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                            isPaid
                              ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400'
                              : isExpired
                              ? 'border-rose-500/30 bg-rose-500/15 text-rose-400'
                              : isSuspended
                              ? 'border-amber-500/30 bg-amber-500/15 text-amber-400'
                              : 'border-slate-700 bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isPaid ? <CheckCircle size={11} /> : isExpired ? <AlertCircle size={11} /> : <Clock size={11} />}
                          {s.status === 'active'
                            ? tCopy('COPY.ACTIVE')
                            : s.status === 'expired'
                            ? tCopy('COPY.EXPIRED')
                            : s.status === 'suspended'
                            ? tCopy('COPY.SUSPENDED')
                            : tCopy('COPY.CANCELLED')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled
                            aria-label={tCopy("COPY.SAMPLE_SUBSCRIPTION_RENEWAL_UNAVAILABLE_ARIA_LABEL", { id: s.id })}
                            title={tCopy("COPY.UNAVAILABLE_THIS_SAMPLE_ROW_S_NUMERIC_SUBSCRIPTION_ID_IS_NOT_A_VER_DF48664C")}
                            className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
                            data-testid={`superadmin-finance-finance-subscriptions-sample-subscription-renewal-unavailable-aria-label-4-${String(s.id)}`}
                          >
                            <span>{tCopy("COPY.RENEWAL_UNAVAILABLE")}</span>
                          </button>
                          <button
                            type="button"
                            disabled
                            title={tCopy("COPY.UNAVAILABLE_NO_SUBSCRIPTION_DETAIL_ROUTE_DATA_CONTRACT_IS_SUPPLIED")}
                            className="inline-flex items-center gap-1 rounded-xl border border-indigo-500/20 bg-indigo-500/5 px-2 py-1 text-xs font-semibold text-slate-400 opacity-60 cursor-not-allowed"
                            data-testid={`superadmin-finance-finance-subscriptions-unavailable-no-subscription-detail-route-data-contract-is-supplied-5-${String(s.id)}`}
                          >
                            <Eye size={12} />
                            <span>{tCopy("COPY.VIEW_UNAVAILABLE")}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
