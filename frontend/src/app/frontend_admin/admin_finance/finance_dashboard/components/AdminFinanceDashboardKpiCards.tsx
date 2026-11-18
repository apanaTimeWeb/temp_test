'use client';

import type { ElementType, ReactNode } from 'react';

export interface AdminFinanceStatCardItem {
  label: string;
  value: string | number;
  icon: ElementType;
  periodBadge: string | null;
  sub: ReactNode;
  variant: 'default' | 'warning' | 'danger';
  color: string;
}

interface AdminFinanceDashboardKpiCardsProps {
  statCards: AdminFinanceStatCardItem[];
  isLoading: boolean;
}

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

interface KpiStyleConfig {
  cardBorderBg: string;
  iconBox: string;
  iconColor: string;
  strokeColor: string;
  badgeBg: string;
}

const COLOR_STYLES: Record<string, KpiStyleConfig> = {
  emerald: {
    cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
    iconBox: 'bg-emerald-500/15 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    strokeColor: '#34d399',
    badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
  },
  blue: {
    cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
    iconBox: 'bg-cyan-500/15 border-cyan-500/30',
    iconColor: 'text-cyan-400',
    strokeColor: '#22d3ee',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
  },
  amber: {
    cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
    iconBox: 'bg-amber-500/15 border-amber-500/30',
    iconColor: 'text-amber-400',
    strokeColor: '#fbbf24',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  },
  rose: {
    cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
    iconBox: 'bg-rose-500/15 border-rose-500/30',
    iconColor: 'text-rose-400',
    strokeColor: '#f87171',
    badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
  },
};

export function AdminFinanceDashboardKpiCards({ statCards, isLoading }: AdminFinanceDashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i + 1}`} className="rounded-2xl border border-white/10 bg-card p-5 shadow-card space-y-3">
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-28" />
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-8 w-20" />
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-24" />
            </div>
          ))
        : statCards.map(({ label, value, icon: Icon, sub, color, periodBadge }) => {
            const style = COLOR_STYLES[color] ?? COLOR_STYLES.blue;
            const sparklinePath = generateSparkline(label);

            return (
              <div
                key={label}
                className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${style.cardBorderBg}`}
              >
                {/* Decorative sparkline using theme accent color matching Superadmin UI */}
                <svg
                  aria-hidden="true"
                  className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
                  viewBox="0 0 150 45"
                >
                  <path d={sparklinePath} fill="none" stroke={style.strokeColor} strokeWidth="3" strokeLinecap="round" />
                </svg>

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">
                      {label}
                    </span>
                    {periodBadge && (
                      <span className={`self-start rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-xs ${style.badgeBg}`}>
                        {periodBadge}
                      </span>
                    )}
                  </div>
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 shadow-xs ${style.iconBox}`}>
                    <Icon size={18} className={style.iconColor} strokeWidth={2.2} />
                  </div>
                </div>

                <div className="relative z-10 mt-3 sm:mt-4">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white tabular-nums">
                    {value}
                  </p>
                  {sub && <div className="mt-3.5 flex items-center pt-2.5 border-t border-white/10 text-xs text-slate-400">{sub}</div>}
                </div>
              </div>
            );
          })}
    </div>
  );
}

export default AdminFinanceDashboardKpiCards;
