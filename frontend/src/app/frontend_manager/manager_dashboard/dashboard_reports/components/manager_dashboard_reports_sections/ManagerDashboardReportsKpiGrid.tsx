'use client';
// RESPONSIBILITY: Render the dashboard reports kpi grid component within the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerDashboardReportsEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/ManagerDashboardReportsEmptyState';
import type { ManagerDashboardReportsKpiCard } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
import { getManagerReportsTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/utils/ManagerDashboardReportsTrendTone';
import { CalendarCheck,Phone,TrendingDown,TrendingUp,UserPlus,Users,type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
        cardBg: 'mgr-reports-kpi-surface--indigo border-indigo-500/40 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60 hover:shadow-indigo-950/60',
        iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
        badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        valColor: 'text-white',
        titleColor: 'text-indigo-300',
        strokeClass: 'text-indigo-400',
        accent: 'text-indigo-400',
        glow: 'bg-indigo-500/20 group-hover:bg-indigo-500/30',
      };
    case 'CalendarCheck':
      return {
        cardBg: 'mgr-reports-kpi-surface--emerald border-emerald-500/40 shadow-lg shadow-emerald-950/40 hover:border-emerald-400/60 hover:shadow-emerald-950/60',
        iconBox: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        valColor: 'text-emerald-400',
        titleColor: 'text-emerald-300',
        strokeClass: 'text-emerald-400',
        accent: 'text-emerald-400',
        glow: 'bg-emerald-500/20 group-hover:bg-emerald-500/30',
      };
    case 'UserPlus':
      return {
        cardBg: 'mgr-reports-kpi-surface--cyan border-cyan-500/40 shadow-lg shadow-cyan-950/40 hover:border-cyan-400/60 hover:shadow-cyan-950/60',
        iconBox: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        valColor: 'text-cyan-400',
        titleColor: 'text-cyan-300',
        strokeClass: 'text-cyan-400',
        accent: 'text-cyan-400',
        glow: 'bg-cyan-500/20 group-hover:bg-cyan-500/30',
      };
    case 'Phone':
      return {
        cardBg: 'mgr-reports-kpi-surface--amber border-amber-500/40 shadow-lg shadow-amber-950/40 hover:border-amber-400/60 hover:shadow-amber-950/60',
        iconBox: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        valColor: 'text-amber-400',
        titleColor: 'text-amber-300',
        strokeClass: 'text-amber-400',
        accent: 'text-amber-400',
        glow: 'bg-amber-500/20 group-hover:bg-amber-500/30',
      };
    default:
      return {
        cardBg: 'mgr-reports-kpi-surface--indigo border-indigo-500/40 shadow-lg shadow-indigo-950/40 hover:border-indigo-400/60 hover:shadow-indigo-950/60',
        iconBox: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400',
        badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        valColor: 'text-white',
        titleColor: 'text-indigo-300',
        strokeClass: 'text-indigo-400',
        accent: 'text-indigo-400',
        glow: 'bg-indigo-500/20 group-hover:bg-indigo-500/30',
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
            className={`group relative overflow-hidden rounded-2xl border p-5 shadow-lg motion-safe:transition-all motion-safe:duration-slow hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${theme.cardBg}`}
          >
            {/* Glowing Orb */}
            <div className={`pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full blur-2xl motion-safe:transition-all motion-safe:duration-xslow ${theme.glow}`} />

            {/* Decorative Sparkline */}
            <svg aria-hidden="true" className={`pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-25 overflow-visible motion-safe:transition-opacity motion-safe:duration-slow group-hover:opacity-40 ${theme.strokeClass}`} viewBox="0 0 150 40" fill="none">
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}>
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
                  <p className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-sans tabular-nums ${theme.valColor}`}>
                    {card.value}
                  </p>
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${theme.badge}`}>
                    [{dateRange}]
                  </span>
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wider mt-1.5 ${theme.titleColor}`}>
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
