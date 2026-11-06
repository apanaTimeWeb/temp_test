'use client';
// Responsibility: AdminFinanceDashboardPage component owned by admin_finance; responsibility folder: admin_finance_components_views.

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import {
  PiggyBank, Users, Clock, Ban, UsersRound, ShieldAlert,
  TrendingUp, TrendingDown, IndianRupee, Receipt, AlertTriangle, RefreshCw,
  Calendar, Landmark,
} from 'lucide-react';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_dashboard/utils/AdminFinanceDashboardFormat';
import { ADMIN_FINANCE_DEMO_DASHBOARD_STATS, ADMIN_FINANCE_DEMO_RECENT_PAYMENTS } from '@/app/frontend_admin/admin_finance/finance_dashboard/mocks/AdminFinanceDashboardFixtures';
import type { AdminFinanceDemoDashboardStats, AdminFinanceDemoRecentPayment } from '@/app/frontend_admin/admin_finance/finance_dashboard/types/AdminFinanceDashboardTypes';
import { AdminFinanceDashboardRecentPayments } from './AdminFinanceDashboardRecentPayments';
import { AdminFinanceDashboardKpiCards, type AdminFinanceStatCardItem } from './AdminFinanceDashboardKpiCards';

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

  // Dynamically filter recent transactions according to active horizon
  const displayedPayments = useMemo(() => {
    if (timeRange === 'today') return recentPayments.slice(0, 1);
    if (timeRange === 'this_week') return recentPayments.slice(0, 3);
    return recentPayments;
  }, [recentPayments, timeRange]);

  const statCards: AdminFinanceStatCardItem[] = computedStats ? [
    {
      label: t('TOTAL_COLLECTIONS'),
      value: formatAdminFinanceCurrency(computedStats.totalCollections),
      icon: PiggyBank,
      periodBadge: computedStats.periodLabel,
      sub: (
        <span className="inline-flex items-center gap-1 text-caption font-medium text-success-text">
          <TrendingUp size={15} strokeWidth={2.5}/>
          +{computedStats.collectionsGrowth}% {computedStats.periodLabel}
        </span>
      ),
      variant: 'default',
      color: 'emerald',
    },
    {
      label: t('ACTIVE_STUDENTS'),
      value: computedStats.activeStudents,
      icon: Users,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">Network Active Base</span>,
      variant: 'default',
      color: 'blue',
    },
    {
      label: t('EXPIRING_SOON'),
      value: computedStats.expiringSoon,
      icon: Clock,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption font-medium text-warning-text">{t('WITHIN_7_DAYS')}</span>,
      variant: 'warning',
      color: 'amber',
    },
    {
      label: t('CURRENTLY_SUSPENDED'),
      value: computedStats.suspended,
      icon: Ban,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-danger-text font-medium">Access Suspended</span>,
      variant: 'danger',
      color: 'rose',
    },
    {
      label: t('TOTAL_REFERRALS'),
      value: computedStats.totalReferrals,
      icon: UsersRound,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">Affiliate Conversions</span>,
      variant: 'default',
      color: 'blue',
    },
    {
      label: t('DEPOSITS_HELD'),
      value: formatAdminFinanceCurrency(computedStats.depositsHeld),
      icon: ShieldAlert,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">Escrow & Caution Fund</span>,
      variant: 'default',
      color: 'emerald',
    },
    {
      label: t('PENDING_PROMISES'),
      value: computedStats.pendingPromises,
      icon: Receipt,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">{t('PROMISES_PENDING')}</span>,
      variant: 'default',
      color: 'blue',
    },
    {
      label: t('OVERDUE_STUDENTS'),
      value: computedStats.overdueStudents,
      icon: AlertTriangle,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption font-medium text-warning-text">{t('LATE_FEE_ACCRUING')}</span>,
      variant: 'warning',
      color: 'amber',
    },
    {
      label: t('RENEWALS_DUE'),
      value: computedStats.renewalsDue,
      icon: RefreshCw,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">{t('NEED_RENEWAL')}</span>,
      variant: 'default',
      color: 'emerald',
    },
    {
      label: t('PENDING_REFUNDS'),
      value: computedStats.pendingRefunds,
      icon: IndianRupee,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption text-text-secondary">{t('DEPOSIT_REFUNDS')}</span>,
      variant: 'default',
      color: 'amber',
    },
    {
      label: t('LATE_FEE_ACCRUED'),
      value: formatAdminFinanceCurrency(computedStats.lateFeeAccrued),
      icon: TrendingDown,
      periodBadge: computedStats.periodLabel,
      sub: <span className="text-caption font-medium text-danger-text">{computedStats.periodLabel}</span>,
      variant: 'danger',
      color: 'rose',
    },
  ] : [];

  return (
    <div className="space-y-6 pb-10">
      {!isDemoMode && (
        <div role="status" className="rounded-xl border border-border bg-warning-bg p-3 text-xs font-medium text-warning-text">
          {t('LIVE_UNAVAILABLE')}
        </div>
      )}

      {/* Executive Financial Header & Global Horizon Bar */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-success-bg px-2.5 py-0.5 text-xs font-semibold text-success-text">
                <Landmark className="h-3.5 w-3.5" />
                Network Treasury & Collections
              </span>
              <span className="text-xs text-text-secondary">• Central Ledger</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('TITLE')}</h1>
            <p className="text-sm text-text-secondary max-w-2xl">{t('SUBTITLE')}</p>
          </div>

          {/* Unified Global Time Horizon Segmented Pill Bar */}
          <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-border bg-card p-2 shadow-sm">
            <div className="flex items-center rounded-lg bg-surface-highlight p-1 border border-border">
              <button
                type="button"
                onClick={() => setTimeRange('today')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'today'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_week')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'this_week'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_month')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'this_month'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('custom')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  timeRange === 'custom'
                    ? 'bg-primary text-primary-foreground shadow-sm scale-[1.02]'
                    : 'text-text-secondary hover:text-text-primary'
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
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-primary shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Start date"
                />
                <span className="text-text-secondary">to</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-text-primary shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="End date"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern KPI Cards Grid */}
      <AdminFinanceDashboardKpiCards statCards={statCards} isLoading={isLoading} />

      {/* Recent Payments Section */}
      <AdminFinanceDashboardRecentPayments
        displayedPayments={displayedPayments}
        totalPaymentsCount={recentPayments.length}
        isLoading={isLoading}
        periodLabel={computedStats?.periodLabel ?? 'This Month'}
        emptyText={t('EMPTY_PAYMENTS')}
        formatCurrency={formatAdminFinanceCurrency}
      />
    </div>
  );
}
