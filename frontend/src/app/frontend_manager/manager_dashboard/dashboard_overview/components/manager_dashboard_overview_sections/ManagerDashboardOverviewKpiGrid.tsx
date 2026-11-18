import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Users, CalendarCheck, Phone, Armchair, TrendingUp, TrendingDown, ChevronRight, type LucideIcon } from 'lucide-react';
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { getManagerDashboardTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewTrend';
import { MANAGER_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/config/manager_dashboard_overview.url_config';
import type { ManagerDashboardOverviewKpiGridProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';

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
      case 'today':
        return 'Today';
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

  const getRouteForKpi = (title: string): string => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
      case 'Active Students':
      case 'Active Members':
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS;
      case 'Expiring Members':
      case 'Expiring Soon':
      case 'Renewals Due':
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.FINANCE_RENEWALS;
      case 'Attendance Today':
      case 'Today Attendance':
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.ENGAGEMENT_ATTENDANCE;
      case 'New Enquiries':
      case 'New Inquiries':
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.CRM_ENQUIRIES;
      case 'Occupied Seats':
      case 'Seats Occupied':
        return '/frontend_manager/manager_seats_shifts_lockers/seats_matrix';
      default:
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS;
    }
  };

  const getKpiTheme = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
      case 'Active Students':
      case 'Active Members':
        return {
          cardBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60',
          iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          stroke: '#818cf8',
          textMuted: 'text-indigo-200/70',
          accent: 'text-indigo-400',
          progress: 'from-indigo-500 to-indigo-400',
        };
      case 'Expiring Members':
      case 'Expiring Soon':
      case 'Renewals Due':
        return {
          cardBg: 'border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#261708] to-amber-900/60 shadow-lg shadow-amber-950/40 hover:border-amber-400/60',
          iconBox: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
          badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          stroke: '#fbbf24',
          textMuted: 'text-amber-200/70',
          accent: 'text-amber-400',
          progress: 'from-amber-500 to-amber-400',
        };
      case 'Attendance Today':
      case 'Today Attendance':
        return {
          cardBg: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60',
          iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
          badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          stroke: '#34d399',
          textMuted: 'text-emerald-200/70',
          accent: 'text-emerald-400',
          progress: 'from-emerald-500 to-emerald-400',
        };
      case 'New Enquiries':
      case 'New Inquiries':
        return {
          cardBg: 'border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 shadow-lg shadow-sky-950/40 hover:border-sky-400/60',
          iconBox: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
          badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          stroke: '#38bdf8',
          textMuted: 'text-sky-200/70',
          accent: 'text-sky-400',
          progress: 'from-sky-500 to-sky-400',
        };
      case 'Occupied Seats':
      case 'Seats Occupied':
        return {
          cardBg: 'border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-[#24133f] to-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-400/60',
          iconBox: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
          badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          stroke: '#c084fc',
          textMuted: 'text-purple-200/70',
          accent: 'text-purple-400',
          progress: 'from-purple-500 to-purple-400',
        };
      default:
        return {
          cardBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60',
          iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
          badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
          stroke: '#818cf8',
          textMuted: 'text-indigo-200/70',
          accent: 'text-indigo-400',
          progress: 'from-indigo-500 to-indigo-400',
        };
    }
  };

  const getKpiSubtitle = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
        return 'Active enrolled students';
      case 'Expiring Members':
      case 'Expiring Soon':
      case 'Renewals Due':
        return 'Subscriptions expiring soon';
      case 'Attendance Today':
      case 'Today Attendance':
        if (timeRange === 'this_week') return 'Total check-ins this week';
        if (timeRange === 'this_month') return 'Monthly attendance aggregate';
        if (timeRange === 'custom') return 'Check-ins for custom period';
        return 'Check-ins recorded today';
      case 'New Enquiries':
      case 'New Inquiries':
        if (timeRange === 'this_week') return 'Leads logged this week';
        if (timeRange === 'this_month') return 'Total leads this month';
        if (timeRange === 'custom') return 'Leads in custom period';
        return 'Leads awaiting follow-up';
      case 'Occupied Seats':
      case 'Seats Occupied':
        return '75% total hall capacity';
      default:
        return '';
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
        const route = getRouteForKpi(kpi.title);
        const theme = getKpiTheme(kpi.title);
        const isSeats = kpi.title.includes('Seat');

        return (
          <Link
            key={kpi.title}
            href={route}
            className={`mgr-kpi-card group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer overflow-hidden text-inherit no-underline ${theme.cardBg}`}
          >
            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q20,15 45,28 T90,14 T130,22 T150,8" fill="none" stroke={theme.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
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
                    className="text-slate-400 opacity-50 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="mgr-kpi-value text-3xl font-extrabold tracking-tight text-white font-sans">
                    {kpi.value}
                  </p>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    [{periodBadgeLabel}]
                  </span>
                </div>
                <p className="mgr-kpi-label text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">
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
                    <div className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 w-3/4 ${theme.progress}`} />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-300/80 flex items-center justify-between">
                  <span>{getKpiSubtitle(kpi.title)}</span>
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
