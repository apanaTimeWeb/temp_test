'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { TrendingUp, RotateCw, Calendar, MapPin, Clock, CalendarRange } from 'lucide-react';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';

export type DashboardTimeRange = 'today' | 'this_week' | 'this_month' | 'custom';

export interface ManagerDashboardOverviewHeaderBarProps {
  currentDateStr: string;
  isFetching: boolean;
  onRefresh: () => void;
  timeRange: DashboardTimeRange;
  onTimeRangeChange: (range: DashboardTimeRange) => void;
  customStartDate: string;
  onCustomStartDateChange: (val: string) => void;
  customEndDate: string;
  onCustomEndDateChange: (val: string) => void;
  branchName?: string;
}

export function ManagerDashboardOverviewHeaderBar({
  currentDateStr,
  isFetching,
  onRefresh,
  timeRange,
  onTimeRangeChange,
  customStartDate,
  onCustomStartDateChange,
  customEndDate,
  onCustomEndDateChange,
  branchName,
}: ManagerDashboardOverviewHeaderBarProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mgr-breadcrumb">{tManagerUi('manager_dashboard_8ccadd')}</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-bg text-success border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Shift Operational
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-highlight text-muted-foreground border border-border">
              <MapPin size={11} className="text-primary" />
              {branchName || 'Central Branch'}
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
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted text-xs text-secondary font-medium">
              <Calendar size={13} className="text-primary" />
              <span>{currentDateStr}</span>
            </div>
          )}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-surface-hover hover:border-primary transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
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
      <div className="mt-5 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock size={13} className="text-primary" />
            Time Horizon:
          </span>
          <div className="inline-flex items-center rounded-xl bg-surface-highlight border border-border p-1 gap-1">
            <button
              type="button"
              onClick={() => onTimeRangeChange('today')}
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
              onClick={() => onTimeRangeChange('this_week')}
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
              onClick={() => onTimeRangeChange('this_month')}
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
              onClick={() => onTimeRangeChange('custom')}
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
          <div className="flex items-center gap-2 bg-card border border-primary p-1.5 rounded-xl text-xs shadow-xs animate-in fade-in duration-200">
            <span className="text-muted-foreground font-medium pl-1">From:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => onCustomStartDateChange(e.target.value)}
              className="rounded-lg bg-surface-highlight border border-border px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-muted-foreground font-medium">To:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => onCustomEndDateChange(e.target.value)}
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
  );
}

