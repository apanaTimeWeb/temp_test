import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import {
  getManagerDashboardKpiRoute,
  getManagerDashboardKpiSubtitle,
  getManagerDashboardKpiTheme,
} from '@/app/frontend_manager/manager_dashboard/dashboard_overview/constants/ManagerDashboardOverviewKpiThemes';
import type { ManagerDashboardOverviewKpiGridProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
import { getManagerDashboardTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewTrend';
import { Armchair, CalendarCheck, ChevronRight, Phone, TrendingDown, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useMemo } from 'react';

const iconMap: Record<string, LucideIcon> = {
  Users,
  CalendarCheck,
  Phone,
  Armchair,
};

export function ManagerDashboardOverviewKpiGrid({
  kpiData,
  timeRange = 'today',
  timeRangeLabel,
}: ManagerDashboardOverviewKpiGridProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');

  const periodBadgeLabel = useMemo(() => {
    if (timeRangeLabel) return timeRangeLabel;
    switch (timeRange) {
      case 'this_week':
        return 'This Week';
      case 'this_month':
        return 'This Month';
      case 'custom':
        return 'Custom';
      default:
        return 'Today';
    }
  }, [timeRange, timeRangeLabel]);

  const localizeKnownTitle = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
        return tManagerUi('dashboard_kpi_total_students');
      case 'Expiring Members':
      case 'Expiring Soon':
      case 'Renewals Due':
        return 'Renewals Due';
      case 'Attendance Today':
      case 'Today Attendance':
        if (timeRange === 'this_week') return 'Attendance (This Week)';
        if (timeRange === 'this_month') return 'Attendance (This Month)';
        if (timeRange === 'custom') return 'Attendance (Custom)';
        return tManagerUi('dashboard_kpi_attendance_today');
      case 'New Enquiries':
      case 'New Inquiries':
        if (timeRange === 'this_week') return 'New Enquiries (This Week)';
        if (timeRange === 'this_month') return 'New Enquiries (This Month)';
        if (timeRange === 'custom') return 'New Enquiries (Custom)';
        return tManagerUi('dashboard_kpi_new_enquiries');
      case 'Occupied Seats':
      case 'Seats Occupied':
        return tManagerUi('dashboard_kpi_occupied_seats');
      default:
        return title;
    }
  };

  if (!kpiData || kpiData.length === 0) {
    return (
      <ManagerDashboardOverviewEmptyState
        className="mgr-card p-6 text-sm text-secondary"
        testId="manager-dashboard-kpi-empty"
      >
        {tManagerUi('no_dashboard_kpis_available')}
      </ManagerDashboardOverviewEmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const tone = getManagerDashboardTrendTone(kpi.trend);
        const route = getManagerDashboardKpiRoute(kpi.title);
        const theme = getManagerDashboardKpiTheme(kpi.title);
        const isSeats = kpi.title.includes('Seat');

        return (
          <Link
            key={kpi.title}
            href={route}
            className={`group relative flex flex-col justify-between p-5 rounded-2xl border motion-safe:transition-all motion-safe:duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer overflow-hidden text-inherit no-underline ${theme.cardBg}`}
          >
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl motion-safe:transition-all motion-safe:duration-500 ${theme.glow}`} />

            <svg aria-hidden="true" className={`pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-40 ${theme.strokeClass}`} viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold motion-safe:transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
                  {Icon && <Icon size={20} />}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tone === 'up'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : tone === 'down'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                    }`}
                  >
                    {tone === 'up' && <TrendingUp size={11} />}
                    {tone === 'down' && <TrendingDown size={11} />}
                    {kpi.trend}
                  </span>
                  <ChevronRight
                    size={15}
                    className="text-slate-400 opacity-50 group-hover:text-white group-hover:translate-x-0.5 motion-safe:transition-all shrink-0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className={`mgr-kpi-value text-3xl font-extrabold tracking-tight font-sans ${theme.valColor}`}>
                    {kpi.value}
                  </p>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    [{periodBadgeLabel}]
                  </span>
                </div>
                <p className={`mgr-kpi-label text-xs font-semibold uppercase tracking-wider mt-1 ${theme.titleColor}`}>
                  {localizeKnownTitle(kpi.title)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 relative z-10">
              {isSeats ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <span>Occupancy</span>
                    <span className="font-semibold text-white">75%</span>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r motion-safe:transition-all motion-safe:duration-500 w-3/4 ${theme.progress}`} />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-300/80 flex items-center justify-between">
                  <span>{getManagerDashboardKpiSubtitle(kpi.title, timeRange)}</span>
                  <span className={`${theme.accent} font-medium group-hover:underline`}>View →</span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
