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
          cardBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-lg shadow-indigo-950/30 hover:border-indigo-500/40 hover:shadow-indigo-950/40',
          iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
          stroke: '#818cf8',
          textMuted: 'text-indigo-200/70',
          accent: 'text-indigo-400',
          progress: 'from-indigo-500 to-indigo-400',
          glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
        };
      case 'Expiring Members':
      case 'Expiring Soon':
      case 'Renewals Due':
        return {
          cardBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-lg shadow-amber-950/30 hover:border-amber-500/40 hover:shadow-amber-950/40',
          iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
          stroke: '#fbbf24',
          textMuted: 'text-amber-200/70',
          accent: 'text-amber-400',
          progress: 'from-amber-500 to-amber-400',
          glow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
        };
      case 'Attendance Today':
      case 'Today Attendance':
        return {
          cardBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-lg shadow-emerald-950/30 hover:border-emerald-500/40 hover:shadow-emerald-950/40',
          iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
          stroke: '#34d399',
          textMuted: 'text-emerald-200/70',
          accent: 'text-emerald-400',
          progress: 'from-emerald-500 to-emerald-400',
          glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
        };
      case 'New Enquiries':
      case 'New Inquiries':
        return {
          cardBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-lg shadow-cyan-950/30 hover:border-cyan-500/40 hover:shadow-cyan-950/40',
          iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
          badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
          stroke: '#22d3ee',
          textMuted: 'text-cyan-200/70',
          accent: 'text-cyan-400',
          progress: 'from-cyan-500 to-cyan-400',
          glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
        };
      case 'Occupied Seats':
      case 'Seats Occupied':
        return {
          cardBg: 'border-purple-500/25 bg-gradient-to-br from-[#180c28]/95 via-[#180c28]/90 to-[#221238]/80 shadow-lg shadow-purple-950/30 hover:border-purple-500/40 hover:shadow-purple-950/40',
          iconBox: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
          badge: 'bg-purple-500/10 text-purple-300 border-purple-500/25',
          stroke: '#c084fc',
          textMuted: 'text-purple-200/70',
          accent: 'text-purple-400',
          progress: 'from-purple-500 to-purple-400',
          glow: 'bg-purple-500/10 group-hover:bg-purple-500/20',
        };
      default:
        return {
          cardBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-lg shadow-indigo-950/30 hover:border-indigo-500/40 hover:shadow-indigo-950/40',
          iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
          badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
          stroke: '#818cf8',
          textMuted: 'text-indigo-200/70',
          accent: 'text-indigo-400',
          progress: 'from-indigo-500 to-indigo-400',
          glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
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
            className={`group relative flex flex-col justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer overflow-hidden text-inherit no-underline ${theme.cardBg}`}
          >
            {/* Glowing Orb */}
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl transition-all duration-500 ${theme.glow}`} />

            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={theme.stroke} strokeWidth="2.5" strokeLinecap="round" />
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
