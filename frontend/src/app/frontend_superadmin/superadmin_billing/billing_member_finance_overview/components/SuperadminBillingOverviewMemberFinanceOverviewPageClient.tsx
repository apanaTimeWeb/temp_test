'use client';
/** Responsibility: Superadmin Finance Finance Dashboard Page Client; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: canonical route props -> SuperadminBillingOverviewMemberFinanceOverviewPageClient -> typed leaf-owned child components; sibling business modules are not required. */

import { useTranslations, useLocale } from 'next-intl';

import {
  PiggyBank, Users, Clock, Ban, UsersRound, ShieldAlert,
  TrendingUp, TrendingDown, IndianRupee, Receipt, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { formatMajorUnitPreviewCurrency } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/utils/SuperadminBillingOverviewMemberFinanceOverviewFormatters';
import type { DashboardStats, RecentPayment } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/types/SuperadminBillingOverviewMemberFinanceOverviewPageClientComponentTypes';


import { SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_MOCK_STATS as MOCK_STATS, SUPERADMIN_BILLING_OVERVIEW_MEMBER_FINANCE_OVERVIEW_MOCK_RECENT_PAYMENTS as MOCK_RECENT_PAYMENTS } from '@/app/frontend_superadmin/superadmin_billing/billing_member_finance_overview/mocks/fixtures/SuperadminBillingOverviewMemberFinanceOverviewMockFixtures';


/**
 * Renders the `superadmin_member_finance` view owned by `SuperadminBillingOverviewMemberFinanceOverviewPageClient`.
 * Renders explicitly labeled local preview data immediately; it does not simulate a network request.
 */
export default function SuperadminBillingOverviewMemberFinanceOverviewPageClient() {
  const tCopy = useTranslations('SUPERADMIN_FINANCE');
  const locale = useLocale();
  const stats: DashboardStats = MOCK_STATS;
  const recentPayments: RecentPayment[] = MOCK_RECENT_PAYMENTS;

  const statCards = stats ? [
    { label: tCopy('COPY.TOTAL_COLLECTIONS'),   value: formatMajorUnitPreviewCurrency(stats.totalCollections, 'INR', locale), icon: PiggyBank,     sub: <span className="fin-trend-up"><TrendingUp size={12} />+{stats.collectionsGrowth}{tCopy("COPY.VS_LAST_MONTH")}</span>, variant: 'default' as const },
    { label: tCopy('COPY.ACTIVE_STUDENTS'),      value: stats.activeStudents,                   icon: Users,         sub: null,                                                                                                    variant: 'default' as const },
    { label: tCopy('COPY.EXPIRING_SOON'),        value: stats.expiringSoon,                     icon: Clock,         sub: <span className="fin-text-warning fin-text-xs">{tCopy("COPY.WITHIN_7_DAYS")}</span>,                                    variant: 'warning' as const },
    { label: tCopy('COPY.CURRENTLY_SUSPENDED'),  value: stats.suspended,                        icon: Ban,           sub: null,                                                                                                    variant: 'danger'  as const },
    { label: tCopy('COPY.TOTAL_REFERRALS'),      value: stats.totalReferrals,                   icon: UsersRound,    sub: null,                                                                                                    variant: 'default' as const },
    { label: tCopy('COPY.DEPOSITS_HELD'),        value: formatMajorUnitPreviewCurrency(stats.depositsHeld, 'INR', locale),     icon: ShieldAlert,   sub: null,                                                                                                    variant: 'default' as const },
    { label: tCopy('COPY.PENDING_PROMISES'),     value: stats.pendingPromises,                  icon: Receipt,       sub: <span className="fin-text-muted fin-text-xs">{tCopy("COPY.PAYMENT_PROMISES_PENDING")}</span>,                           variant: 'default' as const },
    { label: tCopy('COPY.OVERDUE_STUDENTS'),     value: stats.overdueStudents,                  icon: AlertTriangle, sub: <span className="fin-text-warning fin-text-xs">{tCopy("COPY.LATE_FEE_ACCRUING")}</span>,                                variant: 'warning' as const },
    { label: tCopy('COPY.RENEWALS_DUE'),         value: stats.renewalsDue,                      icon: RefreshCw,     sub: <span className="fin-text-muted fin-text-xs">{tCopy("COPY.NEED_RENEWAL")}</span>,                                       variant: 'default' as const },
    { label: tCopy('COPY.PENDING_REFUNDS'),      value: stats.pendingRefunds,                   icon: IndianRupee,   sub: <span className="fin-text-muted fin-text-xs">{tCopy("COPY.DEPOSIT_REFUND_REQUESTS")}</span>,                            variant: 'default' as const },
    { label: tCopy('COPY.LATE_FEE_ACCRUED_2'),     value: formatMajorUnitPreviewCurrency(stats.lateFeeAccrued, 'INR', locale),   icon: TrendingDown,  sub: <span className="fin-text-danger fin-text-xs">{tCopy("COPY.THIS_MONTH")}</span>,                                        variant: 'danger'  as const },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="fin-page-title">{tCopy("COPY.DASHBOARD")}</h1>
        <p className="fin-page-subtitle">{tCopy("COPY.OVERVIEW_OF_FINANCIAL_INTELLIGENCE")}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, sub, variant }) => (
              <div
                key={label}
                className={`fin-kpi-card${variant === 'warning' ? ' fin-kpi-card--warning' : variant === 'danger' ? ' fin-kpi-card--danger' : ''}`}
              >
                <div className="fin-kpi-card__header">
                  <span className={`fin-kpi-label${variant === 'warning' ? ' fin-kpi-label--warning' : variant === 'danger' ? ' fin-kpi-label--danger' : ''}`}>
                    {label}
                  </span>
                  <Icon size={16} className={variant === 'warning' ? 'fin-text-warning' : variant === 'danger' ? 'fin-text-danger' : 'fin-icon-muted'} />
                </div>
                <p className={`fin-kpi-value${variant === 'warning' ? ' fin-kpi-value--warning' : variant === 'danger' ? ' fin-kpi-value--danger' : ''}`}>
                  {value}
                </p>
                {sub && <div className="mt-1">{sub}</div>}
              </div>
            ))}
      </div>

      {/* Recent Payments */}
      <div className="fin-card">
        <div className="flex items-center gap-2 p-6 fin-border-bottom">
          <Receipt size={20} className="fin-icon-muted" />
          <span className="fin-text-body font-semibold">{tCopy("COPY.RECENT_PAYMENTS")}</span>
        </div>
        <div>
          {recentPayments.map((p) => (
                <div key={p.id} className="fin-payment-row">
                  <div>
                    <div className="fin-cell-name">{p.studentName}</div>
                    <div className="fin-cell-subtext">{p.studentSmartId} · {p.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`fin-badge fin-badge--${p.mode}`}>{p.mode}</span>
                    <span className="font-semibold fin-text-sm fin-text-primary">{tCopy('COPY.FINANCIAL_DETAIL_ONLY')}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
