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

const getReportTheme = (icon: string) => {
  switch (icon) {
    case 'Users':
      return {
        cardBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60',
        iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        stroke: '#818cf8',
        accent: 'text-indigo-400',
      };
    case 'CalendarCheck':
      return {
        cardBg: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0e2c21] to-emerald-900/60 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60',
        iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
        badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        stroke: '#34d399',
        accent: 'text-emerald-400',
      };
    case 'UserPlus':
      return {
        cardBg: 'border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-[#24133f] to-purple-900/60 shadow-lg shadow-purple-950/40 hover:border-purple-400/60',
        iconBox: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
        badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
        stroke: '#c084fc',
        accent: 'text-purple-400',
      };
    case 'Phone':
      return {
        cardBg: 'border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0e2540] to-sky-900/60 shadow-lg shadow-sky-950/40 hover:border-sky-400/60',
        iconBox: 'bg-sky-500/20 border-sky-500/40 text-sky-400',
        badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
        stroke: '#38bdf8',
        accent: 'text-sky-400',
      };
    default:
      return {
        cardBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#181c4b] to-indigo-900/60 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60',
        iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
        badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        stroke: '#818cf8',
        accent: 'text-indigo-400',
      };
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
        const theme = getReportTheme(card.icon);

        return (
          <div
            key={card.title}
            className={`mgr-kpi-card relative overflow-hidden p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl group flex flex-col justify-between ${theme.cardBg}`}
          >
            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 opacity-15 group-hover:opacity-30 motion-safe:transition-opacity pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,12 50,26 T95,15 T135,24 T150,6" fill="none" stroke={theme.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center font-bold transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
                  <Icon size={20} />
                </div>

                {card.trend && (
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
                    {card.trend}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="mgr-kpi-value text-3xl font-extrabold tracking-tight text-white font-sans">
                    {card.value}
                  </p>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    [{dateRange}]
                  </span>
                </div>
                <p className="mgr-kpi-label text-xs font-semibold uppercase tracking-wider text-slate-300 mt-1">
                  {card.title}
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300/80 relative z-10">
              <span>Verified {dateRange} Metric</span>
              <span className={`${theme.accent} font-medium`}>Synced</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
