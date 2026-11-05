'use client';
// Responsibility: AdminFinanceDashboardPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

// RESPONSIBILITY: Entry page for the admin_finance module.
// DATA FLOW: Next.js Router -> Page -> Components

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  PiggyBank, Users, Clock, Ban, UsersRound, ShieldAlert,
  TrendingUp, TrendingDown, IndianRupee, Receipt, AlertTriangle, RefreshCw,
  Calendar, Landmark, CheckCircle2, ChevronRight
} from 'lucide-react';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_dashboard/utils/AdminFinanceDashboardFormat';
import { ADMIN_FINANCE_DEMO_DASHBOARD_STATS, ADMIN_FINANCE_DEMO_RECENT_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_dashboard/mocks/AdminFinanceDashboardFixtures';
import type { AdminFinanceDemoDashboardStats, AdminFinanceDemoRecentPayment } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';

export type AdminFinanceTimeRange = 'today' | 'this_week' | 'this_month' | 'custom';

export function AdminFinanceDashboardPage() {
  const t = useTranslations('ADMIN_FINANCE_DASHBOARD');
  const isDemoMode = isFrontendDemoModeEnabled();
  const [stats] = useState<AdminFinanceDemoDashboardStats | null>(() => isDemoMode ? ADMIN_FINANCE_DEMO_DASHBOARD_STATS : null);
  const [recentPayments] = useState<AdminFinanceDemoRecentPayment[]>(() => isDemoMode ? [...ADMIN_FINANCE_DEMO_RECENT_PAYMENTS] : []);
  const [timeRange, setTimeRange] = useState<AdminFinanceTimeRange>('this_month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const isLoading = false;

  // Dynamically compute period-scaled KPIs based on selected horizon
  const computedStats = useMemo(() => {
    if (!stats) return null;
    let collectionsMultiplier = 1;
    let lateFeeMultiplier = 1;
    let periodLabel = t('THIS_MONTH');

    if (timeRange === 'today') {
      collectionsMultiplier = 0.045;
      lateFeeMultiplier = 0.035;
      periodLabel = 'Today';
    } else if (timeRange === 'this_week') {
      collectionsMultiplier = 0.28;
      lateFeeMultiplier = 0.25;
      periodLabel = 'This Week';
    } else if (timeRange === 'custom') {
      collectionsMultiplier = 0.55;
      lateFeeMultiplier = 0.5;
      periodLabel = 'Custom Horizon';
    }

    return {
      ...stats,
      totalCollections: Math.round(stats.totalCollections * collectionsMultiplier),
      lateFeeAccrued: Math.round(stats.lateFeeAccrued * lateFeeMultiplier),
      periodLabel,
    };
  }, [stats, timeRange, t]);

  const statCards = computedStats ? [
    {
      label: t('TOTAL_COLLECTIONS'),
      value: formatAdminFinanceCurrency(computedStats.totalCollections),
      icon: PiggyBank,
      sub: (
        <span className="inline-flex items-center gap-1 text-caption font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp size={15} strokeWidth={2.5}/>
          +{computedStats.collectionsGrowth}% {computedStats.periodLabel}
        </span>
      ),
      variant: 'default' as const,
      color: 'emerald',
    },
    {
      label: t('ACTIVE_STUDENTS'),
      value: computedStats.activeStudents,
      icon: Users,
      sub: <span className="text-caption text-text-muted">Network Active Base</span>,
      variant: 'default' as const,
      color: 'blue',
    },
    {
      label: t('EXPIRING_SOON'),
      value: computedStats.expiringSoon,
      icon: Clock,
      sub: <span className="text-caption font-medium text-amber-600 dark:text-amber-400">{t('WITHIN_7_DAYS')}</span>,
      variant: 'warning' as const,
      color: 'amber',
    },
    {
      label: t('CURRENTLY_SUSPENDED'),
      value: computedStats.suspended,
      icon: Ban,
      sub: <span className="text-caption text-rose-500 font-medium">Access Suspended</span>,
      variant: 'danger' as const,
      color: 'rose',
    },
    {
      label: t('TOTAL_REFERRALS'),
      value: computedStats.totalReferrals,
      icon: UsersRound,
      sub: <span className="text-caption text-text-muted">Affiliate Conversions</span>,
      variant: 'default' as const,
      color: 'indigo',
    },
    {
      label: t('DEPOSITS_HELD'),
      value: formatAdminFinanceCurrency(computedStats.depositsHeld),
      icon: ShieldAlert,
      sub: <span className="text-caption text-text-muted">Escrow & Caution Fund</span>,
      variant: 'default' as const,
      color: 'purple',
    },
    {
      label: t('PENDING_PROMISES'),
      value: computedStats.pendingPromises,
      icon: Receipt,
      sub: <span className="text-caption text-text-secondary">{t('PROMISES_PENDING')}</span>,
      variant: 'default' as const,
      color: 'sky',
    },
    {
      label: t('OVERDUE_STUDENTS'),
      value: computedStats.overdueStudents,
      icon: AlertTriangle,
      sub: <span className="text-caption font-medium text-amber-600 dark:text-amber-400">{t('LATE_FEE_ACCRUING')}</span>,
      variant: 'warning' as const,
      color: 'amber',
    },
    {
      label: t('RENEWALS_DUE'),
      value: computedStats.renewalsDue,
      icon: RefreshCw,
      sub: <span className="text-caption text-text-secondary">{t('NEED_RENEWAL')}</span>,
      variant: 'default' as const,
      color: 'teal',
    },
    {
      label: t('PENDING_REFUNDS'),
      value: computedStats.pendingRefunds,
      icon: IndianRupee,
      sub: <span className="text-caption text-text-secondary">{t('DEPOSIT_REFUNDS')}</span>,
      variant: 'default' as const,
      color: 'orange',
    },
    {
      label: t('LATE_FEE_ACCRUED'),
      value: formatAdminFinanceCurrency(computedStats.lateFeeAccrued),
      icon: TrendingDown,
      sub: <span className="text-caption font-medium text-rose-600 dark:text-rose-400">{computedStats.periodLabel}</span>,
      variant: 'danger' as const,
      color: 'rose',
    },
  ] : [];

  return (
    <div className="space-y-6 pb-10">
      {!isDemoMode && (
        <div role="status" className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-medium text-amber-700 dark:text-amber-300">
          {t('LIVE_UNAVAILABLE')}
        </div>
      )}

      {/* Executive Financial Header & Global Horizon Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-surface to-surface-elevated p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Landmark className="h-3.5 w-3.5" />
                Network Treasury & Collections
              </span>
              <span className="text-xs text-text-muted">• Central Ledger</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
            <p className="text-sm text-text-secondary max-w-2xl">{t('SUBTITLE')}</p>
          </div>

          {/* Unified Global Time Horizon Segmented Pill Bar */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border/70 bg-surface/90 p-2 shadow-sm backdrop-blur-md">
            <div className="flex items-center rounded-lg bg-surface-muted/60 p-1 border border-border/50">
              <button
                type="button"
                onClick={() => setTimeRange('today')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'today'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_week')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'this_week'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_month')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'this_month'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('custom')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'custom'
                    ? 'bg-primary text-primary-contrast shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                }`}
              >
                <Calendar className="h-3 w-3 shrink-0 opacity-70" />
                Custom Range
              </button>
            </div>

            {timeRange === 'custom' && (
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Start date"
                />
                <span className="text-text-muted">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-text-primary shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="End date"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i + 1}`} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-28" />
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-8 w-20" />
                <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-24" />
              </div>
            ))
          : statCards.map(({ label, value, icon: Icon, sub, variant, color }) => (
              <div
                key={label}
                className="group relative overflow-hidden rounded-xl border border-border/80 bg-surface p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {label}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    color === 'blue' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                    color === 'amber' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    color === 'rose' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                    color === 'indigo' ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                    color === 'purple' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                    color === 'sky' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' :
                    color === 'teal' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' :
                    color === 'orange' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                    'bg-primary/10 text-primary'
                  }`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                  {value}
                </p>
                {sub && <div className="mt-2 flex items-center">{sub}</div>}
              </div>
            ))}
      </div>

      {/* Recent Payments Section */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm">
        <div className="flex items-center justify-between border-b border-border/70 p-5 bg-surface-elevated/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Receipt size={17} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">{t('RECENT_PAYMENTS')}</h2>
              <p className="text-xs text-text-secondary">Direct collections & transactions feed</p>
            </div>
          </div>
          <span className="rounded-full bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-text-secondary">
            {recentPayments.length} entries
          </span>
        </div>

        <div className="divide-y divide-border/60">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i + 1}`} className="flex items-center justify-between gap-4 p-4">
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
            : recentPayments.length === 0 ? (
                <div className="p-8 text-center text-sm text-text-muted">{t('EMPTY_PAYMENTS')}</div>
              ) : (
                recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 p-4 hover:bg-surface-elevated/40 transition-colors">
                    <div>
                      <div className="text-sm font-semibold text-text-primary">{p.studentName}</div>
                      <div className="text-xs text-text-secondary">{p.studentSmartId} · {p.date}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        data-testid="admin_finance-page-state-001"
                        className={`inline-flex min-h-6 items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize whitespace-nowrap ${
                          p.mode === 'cash' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' :
                          p.mode === 'upi' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' :
                          p.mode === 'card' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' :
                          p.mode === 'bank' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' :
                          'bg-surface-muted text-text-secondary border-border'
                        }`}
                      >
                        {p.mode}
                      </span>
                      <span className="font-semibold text-sm text-text-primary">{formatAdminFinanceCurrency(p.amount)}</span>
                    </div>
                  </div>
                ))
              )}
        </div>
      </div>
    </div>
  );
}
