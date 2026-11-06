'use client';
// RESPONSIBILITY: Render the dashboard reports kpi grid component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { CalendarCheck, Phone, UserPlus, Users, TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';
import { ManagerDashboardReportsEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/ManagerDashboardReportsEmptyState';
import type { ManagerDashboardReportsKpiCard } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { MANAGER_REPORTS_KPI_ICON_CLASSES } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/constants/ManagerDashboardReportsConstants';
import { getManagerReportsTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsTrendTone';

const icons: Record<string, LucideIcon> = {
  Users,
  CalendarCheck,
  UserPlus,
  Phone,
};

const getReportIconTheme = (icon: string) => {
  switch (icon) {
    case 'Users':
      return 'bg-warning-bg text-warning border-border';
    case 'CalendarCheck':
      return 'bg-success-bg text-success border-border';
    case 'UserPlus':
      return 'bg-purple-bg text-purple border-border';
    case 'Phone':
      return 'bg-info-bg text-info border-border';
    default:
      return 'bg-primary-subtle text-primary border-border';
  }
};

export function ManagerDashboardReportsKpiGrid({
  cards,
  dateRange = 'This Month',
}: {
  cards: ManagerDashboardReportsKpiCard[];
  dateRange?: string;
}) {
  const tManagerUi = useTranslations('manager.manager_reports.ui');

  if (cards.length === 0) {
    return (
      <ManagerDashboardReportsEmptyState
        className="mgr-card p-6 text-sm text-secondary text-center"
        testId="manager-reports-kpi-empty"
      >
        {tManagerUi('no_report_data_available')}
      </ManagerDashboardReportsEmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = icons[card.icon] || Users;
        const tone = card.trend ? getManagerReportsTrendTone(card.trend) : 'neutral';
        const iconTheme = getReportIconTheme(card.icon);

        return (
          <div
            key={card.title}
            className="mgr-kpi-card p-5 rounded-2xl border border-border bg-card shadow-card hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${iconTheme}`}>
                  <Icon size={20} />
                </div>

                {card.trend && (
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
                    {card.trend}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="mgr-kpi-value text-3xl font-extrabold tracking-tight text-foreground font-sans">
                    {card.value}
                  </p>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-surface-highlight text-primary border border-border">
                    [{dateRange}]
                  </span>
                </div>
                <p className="mgr-kpi-label text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                  {card.title}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Verified {dateRange} Metric</span>
              <span className="text-primary font-medium">Synced</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
