// Responsibility: AdminFinanceDashboardPage component owned by admin_finance; responsibility folder: admin_finance_components_views.
'use client';

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  PiggyBank, Users, Clock, Ban, UsersRound, ShieldAlert,
  TrendingUp, TrendingDown, IndianRupee, Receipt, AlertTriangle, RefreshCw,
} from 'lucide-react';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_dashboard/utils/AdminFinanceDashboardFormat';
import { ADMIN_FINANCE_DEMO_DASHBOARD_STATS, ADMIN_FINANCE_DEMO_RECENT_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_dashboard/mocks/AdminFinanceDashboardFixtures';
import type { AdminFinanceDemoDashboardStats, AdminFinanceDemoRecentPayment } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';



export function AdminFinanceDashboardPage() {
  const t = useTranslations('ADMIN_FINANCE_DASHBOARD');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [stats] = useState<AdminFinanceDemoDashboardStats | null>(() => isDemoMode ? ADMIN_FINANCE_DEMO_DASHBOARD_STATS : null);
  const [recentPayments] = useState<AdminFinanceDemoRecentPayment[]>(() => isDemoMode ? [...ADMIN_FINANCE_DEMO_RECENT_PAYMENTS] : []);
  const isLoading = false;

  const statCards = stats ? [
    { label: t('TOTAL_COLLECTIONS'),   value: formatAdminFinanceCurrency(stats.totalCollections), icon: PiggyBank,     sub: <span className="inline-flex items-center gap-1 text-caption font-medium text-success-text"><TrendingUp size={18} strokeWidth={2}/>+{stats.collectionsGrowth}% {t('VS_LAST_MONTH')}</span>, variant: 'default' as const },
    { label: t('ACTIVE_STUDENTS'),      value: stats.activeStudents,                   icon: Users,         sub: null,                                                                                                    variant: 'default' as const },
    { label: t('EXPIRING_SOON'),        value: stats.expiringSoon,                     icon: Clock,         sub: <span className="text-warning-text text-badge text-text-secondary">{t('WITHIN_7_DAYS')}</span>,                                    variant: 'warning' as const },
    { label: t('CURRENTLY_SUSPENDED'),  value: stats.suspended,                        icon: Ban,           sub: null,                                                                                                    variant: 'danger'  as const },
    { label: t('TOTAL_REFERRALS'),      value: stats.totalReferrals,                   icon: UsersRound,    sub: null,                                                                                                    variant: 'default' as const },
    { label: t('DEPOSITS_HELD'),        value: formatAdminFinanceCurrency(stats.depositsHeld),     icon: ShieldAlert,   sub: null,                                                                                                    variant: 'default' as const },
    { label: t('PENDING_PROMISES'),     value: stats.pendingPromises,                  icon: Receipt,       sub: <span className="text-text-secondary text-badge">{t('PROMISES_PENDING')}</span>,                           variant: 'default' as const },
    { label: t('OVERDUE_STUDENTS'),     value: stats.overdueStudents,                  icon: AlertTriangle, sub: <span className="text-warning-text text-badge text-text-secondary">{t('LATE_FEE_ACCRUING')}</span>,                                variant: 'warning' as const },
    { label: t('RENEWALS_DUE'),         value: stats.renewalsDue,                      icon: RefreshCw,     sub: <span className="text-text-secondary text-badge">{t('NEED_RENEWAL')}</span>,                                       variant: 'default' as const },
    { label: t('PENDING_REFUNDS'),      value: stats.pendingRefunds,                   icon: IndianRupee,   sub: <span className="text-text-secondary text-badge">{t('DEPOSIT_REFUNDS')}</span>,                            variant: 'default' as const },
    { label: t('LATE_FEE_ACCRUED'),     value: formatAdminFinanceCurrency(stats.lateFeeAccrued),   icon: TrendingDown,  sub: <span className="text-danger-text text-badge text-text-secondary">{t('THIS_MONTH')}</span>,                                        variant: 'danger'  as const },
  ] : [];

  return (
    <div className="space-y-6">
      {!isDemoMode && <p role="status" className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{t('LIVE_UNAVAILABLE')}</p>}
      <div>
        <h1 className="text-page-title font-bold text-text-primary">{t('TITLE')}</h1>
        <p className="mt-1 text-body text-text-secondary">{t('SUBTITLE')}</p>
      </div>

      {/* KPI Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i + 1}`} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-28" />
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-8 w-20" />
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-24" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, sub, variant }) => (
              <div
                key={label}
                className={`rounded-xl border border-border bg-card p-5 shadow-card${variant === 'warning' ? ' border-warning-bg bg-warning-bg' : variant === 'danger' ? ' border-danger-bg bg-danger-bg' : ''}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className={`text-badge font-semibold uppercase tracking-[0.08em] text-text-secondary${variant === 'warning' ? ' text-warning-text' : variant === 'danger' ? ' text-danger-text' : ''}`}>
                    {label}
                  </span>
                  <Icon size={18} strokeWidth={2} className={variant === 'warning' ? 'text-warning-text' : variant === 'danger' ? 'text-danger-text' : 'text-text-secondary'} />
                </div>
                <p className={`mt-2 text-kpi font-bold text-text-primary${variant === 'warning' ? ' text-warning-text' : variant === 'danger' ? ' text-danger-text' : ''}`}>
                  {value}
                </p>
                {sub && <div className="mt-1">{sub}</div>}
              </div>
            ))}
      </div>

      {/* Recent Payments */}
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <div className="flex items-center gap-2 p-6 border-b border-border pb-4">
          <Receipt size={18} className="text-text-secondary"  strokeWidth={2}/>
          <span className="text-body text-text-primary font-semibold">{t('RECENT_PAYMENTS')}</span>
        </div>
        <div>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i + 1}`} className="flex items-center justify-between gap-4 border-b border-border p-4">
                  <div className="space-y-1">
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-32" />
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-20" />
                  </div>
                  <div className="text-right space-y-1">
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-16 ml-auto" />
                    <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-12 ml-auto" />
                  </div>
                </div>
              ))
            : recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-4 border-b border-border p-4">
                  <div>
                    <div className="text-body font-semibold text-text-primary">{p.studentName}</div>
                    <div className="text-caption text-text-secondary">{p.studentSmartId} · {p.date}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span data-testid="admin_finance-page-state-001" className={`inline-flex min-h-6 items-center gap-1 rounded-full border border-border px-2 py-1 text-badge font-semibold capitalize whitespace-nowrap ${p.mode === 'cash' ? 'bg-pay-cash-bg text-pay-cash' : p.mode === 'upi' ? 'bg-pay-upi-bg text-pay-upi' : p.mode === 'card' ? 'bg-pay-card-bg text-pay-card' : p.mode === 'bank' ? 'bg-pay-bank-bg text-pay-bank' : 'bg-card text-text-secondary'}`}>{p.mode}</span>
                    <span className="font-semibold text-ui text-text-primary">{formatAdminFinanceCurrency(p.amount)}</span>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
