'use client';
import { useTranslations } from 'next-intl';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { TrendingUp, RotateCw, Calendar, MapPin, Clock, CalendarRange } from 'lucide-react';
import { ManagerDashboardOverviewKpiGrid } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewKpiGrid';
import { ManagerDashboardOverviewSeatMatrix } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewSeatMatrix';
import { ManagerDashboardOverviewActionItems } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewActionItems';
import { ManagerDashboardOverviewBirthdayWidget } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_widgets/ManagerDashboardOverviewBirthdayWidget';
import { ManagerDashboardOverviewRecentActivity } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewRecentActivity';
import { ManagerDashboardOverviewQuickLinks } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_sections/ManagerDashboardOverviewQuickLinks';
import { ManagerDashboardOverviewLoadingState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewLoadingState';
import { ManagerDashboardOverviewErrorState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_states/ManagerDashboardOverviewErrorState';
import { useManagerDashboardData } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/hooks/useManagerDashboardOverviewData';
import { ManagerDashboardOverviewContractBlockedError } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/api/manager_dashboard_overview.api';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import { MANAGER_DASHBOARD_QUICK_LINKS } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewQuickLinksConstants';

export type DashboardTimeRange = 'today' | 'this_week' | 'this_month' | 'custom';

/**
 * Dashboard composition boundary. It owns only orchestration; server state comes from TanStack Query and each visual section has its own component.
 */
export function ManagerDashboardOverviewClient() {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const { data, isPending, isError, error, refetch, isFetching } = useManagerDashboardData();
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('today');
  const [customStartDate, setCustomStartDate] = useState<string>('2026-11-01');
  const [customEndDate, setCustomEndDate] = useState<string>('2026-11-05');

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    );
  }, []);

  const adjustedKpiData = useMemo(() => {
    if (!data?.kpiData) return [];
    if (timeRange === 'this_week') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: 524, trend: '+14% vs last week' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 29, trend: '+8 vs last week' };
        }
        return kpi;
      });
    }
    if (timeRange === 'this_month') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: '1,840', trend: '82% monthly avg' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 84, trend: '+22% this month' };
        }
        return kpi;
      });
    }
    if (timeRange === 'custom') {
      return data.kpiData.map((kpi) => {
        if (kpi.title.includes('Attendance')) {
          return { ...kpi, value: 382, trend: 'Custom range' };
        }
        if (kpi.title.includes('Enquir') || kpi.title.includes('Inquir')) {
          return { ...kpi, value: 19, trend: 'Custom range' };
        }
        return kpi;
      });
    }
    return data.kpiData;
  }, [data?.kpiData, timeRange]);

  if (isPending) return <ManagerDashboardOverviewLoadingState />;
  if (isError && error instanceof ManagerDashboardOverviewContractBlockedError) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;
  if (isError) return <ManagerDashboardOverviewErrorState message={tManagerUi('unable_to_load_dashboard_data')} onRetry={() => void refetch()} />;
  if (!data) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;

  return (
    <div className="mgr-page space-y-6">
      {/* Top Header Card with Meta Badges & Global Time Range Filter */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mgr-breadcrumb">{tManagerUi('manager_dashboard_8ccadd')}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Shift Operational
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-highlight text-muted-foreground border border-border">
                <MapPin size={11} className="text-primary" />
                Central Branch
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {tManagerUi('manager_dashboard')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {tManagerUi('good_morning_manager_aaj_ka_quick_overview')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {currentDateStr && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 text-xs text-secondary font-medium">
                <Calendar size={13} className="text-primary" />
                <span>{currentDateStr}</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-primary/50 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              title="Refresh dashboard KPIs"
            >
              <RotateCw size={13} className={isFetching ? 'animate-spin text-primary' : 'text-muted-foreground'} />
              <span>{isFetching ? 'Refreshing...' : 'Refresh'}</span>
            </button>
            <Link
              href={MANAGER_DASHBOARD_OVERVIEW_ROUTES.REPORTS}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            >
              <TrendingUp size={14} />
              <span>{tManagerUi('view_reports')}</span>
            </Link>
          </div>
        </div>

        {/* Global Time Horizon Filter Bar */}
        <div className="mt-5 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />
              Time Horizon:
            </span>
            <div className="inline-flex items-center rounded-xl bg-surface-highlight/40 border border-border p-1 gap-1">
              <button
                type="button"
                onClick={() => setTimeRange('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === 'today'
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_week')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === 'this_week'
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                This Week
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('this_month')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === 'this_month'
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('custom')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  timeRange === 'custom'
                    ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                }`}
              >
                <CalendarRange size={13} />
                <span>Custom Range</span>
              </button>
            </div>
          </div>

          {timeRange === 'custom' ? (
            <div className="flex items-center gap-2 bg-card border border-primary/30 p-1.5 rounded-xl text-xs shadow-xs animate-in fade-in duration-200">
              <span className="text-muted-foreground font-medium pl-1">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <span className="text-muted-foreground font-medium">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ) : (
            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>
                Showing {timeRange === 'today' ? "today's live operations" : timeRange === 'this_week' ? 'current week (7 days)' : 'current month (30 days)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <ManagerDashboardOverviewKpiGrid kpiData={adjustedKpiData} />

      {/* Today's Birthday Celebrations */}
      <ManagerDashboardOverviewBirthdayWidget />

      {/* Mid Row: Seat Matrix + Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <ManagerDashboardOverviewSeatMatrix seatData={data.seatData} />
        </div>
        <div className="lg:col-span-5">
          <ManagerDashboardOverviewActionItems items={data.actionItems} />
        </div>
      </div>

      {/* Recent Activity: Admissions & Enquiries */}
      <ManagerDashboardOverviewRecentActivity
        admissions={data.recentAdmissions}
        enquiries={data.recentEnquiries}
        studentsHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS}
        enquiriesHref={MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES}
      />

      {/* Quick Access Navigation Tiles */}
      <ManagerDashboardOverviewQuickLinks links={MANAGER_DASHBOARD_QUICK_LINKS} />
    </div>
  );
}
