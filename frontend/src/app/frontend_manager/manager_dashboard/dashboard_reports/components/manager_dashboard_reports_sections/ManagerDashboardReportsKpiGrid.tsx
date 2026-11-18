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
        cardBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-lg shadow-indigo-950/30 hover:border-indigo-500/40 hover:shadow-indigo-950/40',
        iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
        badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
        stroke: '#818cf8',
        accent: 'text-indigo-400',
        glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
      };
    case 'CalendarCheck':
      return {
        cardBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-lg shadow-emerald-950/30 hover:border-emerald-500/40 hover:shadow-emerald-950/40',
        iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
        badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25',
        stroke: '#34d399',
        accent: 'text-emerald-400',
        glow: 'bg-emerald-500/10 group-hover:bg-emerald-500/20',
      };
    case 'UserPlus':
      return {
        cardBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-lg shadow-cyan-950/30 hover:border-cyan-500/40 hover:shadow-cyan-950/40',
        iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25',
        stroke: '#22d3ee',
        accent: 'text-cyan-400',
        glow: 'bg-cyan-500/10 group-hover:bg-cyan-500/20',
      };
    case 'Phone':
      return {
        cardBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-lg shadow-amber-950/30 hover:border-amber-500/40 hover:shadow-amber-950/40',
        iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
        badge: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
        stroke: '#fbbf24',
        accent: 'text-amber-400',
        glow: 'bg-amber-500/10 group-hover:bg-amber-500/20',
      };
    default:
      return {
        cardBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-lg shadow-indigo-950/30 hover:border-indigo-500/40 hover:shadow-indigo-950/40',
        iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
        badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
        stroke: '#818cf8',
        accent: 'text-indigo-400',
        glow: 'bg-indigo-500/10 group-hover:bg-indigo-500/20',
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
            className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${theme.cardBg}`}
          >
            {/* Glowing Orb */}
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl transition-all duration-500 ${theme.glow}`} />

            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible transition-opacity duration-300 group-hover:opacity-40" viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={theme.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
                  <Icon size={20} strokeWidth={2.2} />
                </div>

                {card.trend && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      tone === 'up'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : tone === 'down'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-700/40 text-slate-300 border border-slate-600/40'
                    }`}
                  >
                    {tone === 'up' && <TrendingUp size={11} strokeWidth={2.5} />}
                    {tone === 'down' && <TrendingDown size={11} strokeWidth={2.5} />}
                    {card.trend}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans tabular-nums">
                    {card.value}
                  </p>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    [{dateRange}]
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1.5">
                  {card.title}
                </p>
              </div>
            </div>

            <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span>Verified {dateRange} Metric</span>
              <span className={`${theme.accent} font-medium`}>Synced</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
