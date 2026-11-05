'use client';
import { useTranslations } from 'next-intl';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, RotateCw, Calendar, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
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

/**
 * Dashboard composition boundary. It owns only orchestration; server state comes from TanStack Query and each visual section has its own component.
 */
export function ManagerDashboardOverviewClient() {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const { data, isPending, isError, error, refetch, isFetching } = useManagerDashboardData();
  const [currentDateStr, setCurrentDateStr] = useState<string>('');

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

  if (isPending) return <ManagerDashboardOverviewLoadingState />;
  if (isError && error instanceof ManagerDashboardOverviewContractBlockedError) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;
  if (isError) return <ManagerDashboardOverviewErrorState message={tManagerUi('unable_to_load_dashboard_data')} onRetry={() => void refetch()} />;
  if (!data) return <ManagerDashboardOverviewErrorState message={tManagerUi('dashboard_data_unavailable')} />;

  return (
    <div className="mgr-page space-y-6">
      {/* Top Header Card with Meta Badges */}
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
      </div>

      {/* KPI Stat Cards Grid */}
      <ManagerDashboardOverviewKpiGrid kpiData={data.kpiData} />

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
