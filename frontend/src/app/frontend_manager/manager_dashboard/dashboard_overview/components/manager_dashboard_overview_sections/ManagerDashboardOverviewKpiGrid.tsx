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

export function ManagerDashboardOverviewKpiGrid({ kpiData }: ManagerDashboardOverviewKpiGridProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');

  const localizeKnownTitle = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
        return tManagerUi('dashboard_kpi_total_students');
      case 'Attendance Today':
      case 'Today Attendance':
        return tManagerUi('dashboard_kpi_attendance_today');
      case 'New Enquiries':
      case 'New Inquiries':
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
        return MANAGER_DASHBOARD_OVERVIEW_ROUTES.STUDENTS;
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

  const getIconTheme = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'Attendance Today':
      case 'Today Attendance':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'New Enquiries':
      case 'New Inquiries':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Occupied Seats':
      case 'Seats Occupied':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getKpiSubtitle = (title: string) => {
    switch (title) {
      case 'Total Students':
      case 'Total Members':
        return 'Active enrolled students';
      case 'Attendance Today':
      case 'Today Attendance':
        return 'Check-ins recorded today';
      case 'New Enquiries':
      case 'New Inquiries':
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
        const iconTheme = getIconTheme(kpi.title);
        const isSeats = kpi.title.includes('Seat');

        return (
          <Link
            key={kpi.title}
            href={route}
            className="mgr-kpi-card group relative flex flex-col justify-between p-5 rounded-2xl border border-border bg-card shadow-card hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden text-inherit no-underline"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${iconTheme}`}>
                  {Icon && <Icon size={20} />}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tone === 'up'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : tone === 'down'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                        : 'bg-muted text-muted-foreground border border-border'
                    }`}
                  >
                    {tone === 'up' && <TrendingUp size={11} />}
                    {tone === 'down' && <TrendingDown size={11} />}
                    {kpi.trend}
                  </span>
                  <ChevronRight
                    size={15}
                    className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <p className="mgr-kpi-value text-3xl font-extrabold tracking-tight text-foreground font-sans">
                  {kpi.value}
                </p>
                <p className="mgr-kpi-label text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                  {localizeKnownTitle(kpi.title)}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              {isSeats ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Occupancy</span>
                    <span className="font-semibold text-foreground">75%</span>
                  </div>
                  <div className="w-full bg-surface-highlight rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '75%' }} />
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground/80 flex items-center justify-between">
                  <span>{getKpiSubtitle(kpi.title)}</span>
                  <span className="text-primary font-medium group-hover:underline">View →</span>
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
