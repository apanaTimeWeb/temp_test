'use client';

import type { ElementType } from 'react';
import { TrendingUp } from 'lucide-react';

export interface AdminDashboardExecutiveKpiItem {
  id: string;
  title: string;
  periodBadge: string | null;
  value: string;
  subtext: string;
  Icon: ElementType;
  trend: string;
  theme: string;
}

interface AdminDashboardOverviewKpisProps {
  kpis: AdminDashboardExecutiveKpiItem[];
  sectionLabel: string;
}

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

interface KpiThemeConfig {
  cardBorderBg: string;
  iconBox: string;
  iconColor: string;
  strokeColor: string;
  badgeBg: string;
  trendColor: string;
}

const getKpiTheme = (title: string, id: string): KpiThemeConfig => {
  const t = (title + ' ' + id).toLowerCase();
  if (t.includes('member') || t.includes('user') || t.includes('student')) {
    return {
      cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30',
      iconColor: 'text-emerald-400',
      strokeColor: '#34d399',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      trendColor: 'text-emerald-400',
    };
  }
  if (t.includes('revenue') || t.includes('collection') || t.includes('wallet') || t.includes('fee')) {
    return {
      cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
      iconBox: 'bg-amber-500/15 border-amber-500/30',
      iconColor: 'text-amber-400',
      strokeColor: '#fbbf24',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      trendColor: 'text-amber-400',
    };
  }
  if (t.includes('seat') || t.includes('occupan') || t.includes('locker') || t.includes('armchair')) {
    return {
      cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
      iconBox: 'bg-cyan-500/15 border-cyan-500/30',
      iconColor: 'text-cyan-400',
      strokeColor: '#22d3ee',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      trendColor: 'text-cyan-400',
    };
  }
  if (t.includes('expense') || t.includes('loss') || t.includes('due') || t.includes('alert')) {
    return {
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30',
      iconColor: 'text-rose-400',
      strokeColor: '#f87171',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      trendColor: 'text-rose-400',
    };
  }
  return {
    cardBorderBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30',
    iconBox: 'bg-indigo-500/15 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    strokeColor: '#818cf8',
    badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    trendColor: 'text-indigo-400',
  };
};

export function AdminDashboardOverviewKpis({ kpis, sectionLabel }: AdminDashboardOverviewKpisProps) {
  return (
    <section aria-label={sectionLabel} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi) => {
        const KpiIcon = kpi.Icon;
        const theme = getKpiTheme(kpi.title, kpi.id);
        const sparklinePath = generateSparkline(kpi.title);

        return (
          <article
            key={kpi.id}
            className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl flex flex-col justify-between ${theme.cardBorderBg}`}
          >
            {/* Decorative sparkline using theme-specific accent color matching Superadmin */}
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={sparklinePath} fill="none" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider truncate">
                    {kpi.title}
                  </span>
                  {kpi.periodBadge && (
                    <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-bold border shadow-xs ${theme.badgeBg}`}>
                      {kpi.periodBadge}
                    </span>
                  )}
                </div>
                <div
                  className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${theme.iconBox}`}
                >
                  <KpiIcon className={`h-5 w-5 ${theme.iconColor}`} aria-hidden="true" />
                </div>
              </div>

              <div className="mt-3.5 sm:mt-4 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
                  {kpi.value}
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-3.5 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-2.5">
              <span className="truncate mr-2 font-medium">{kpi.subtext}</span>
              <span className={`inline-flex items-center gap-1 font-bold shrink-0 ${theme.trendColor}`}>
                <TrendingUp size={12} aria-hidden="true" />
                {kpi.trend}
              </span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AdminDashboardOverviewKpis;
