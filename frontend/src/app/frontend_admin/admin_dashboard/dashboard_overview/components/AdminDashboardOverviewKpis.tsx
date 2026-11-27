'use client';

import { TrendingUp } from 'lucide-react';
import type { ElementType } from 'react';

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
  const t = `${title} ${id}`.toLowerCase();
  if (t.includes('member') || t.includes('user') || t.includes('student')) {
    return {
      cardBorderBg: 'border-border bg-card',
      iconBox: 'bg-success-bg border-success',
      iconColor: 'text-success-text',
      strokeColor: 'var(--chart-success)',
      badgeBg: 'bg-success-bg border-success text-success-text',
      trendColor: 'text-success-text',
    };
  }
  if (t.includes('revenue') || t.includes('collection') || t.includes('wallet') || t.includes('fee')) {
    return {
      cardBorderBg: 'border-border bg-card',
      iconBox: 'bg-warning-bg border-warning',
      iconColor: 'text-warning-text',
      strokeColor: 'var(--chart-warning)',
      badgeBg: 'bg-warning-bg border-warning text-warning-text',
      trendColor: 'text-warning-text',
    };
  }
  if (t.includes('seat') || t.includes('occupan') || t.includes('locker') || t.includes('armchair')) {
    return {
      cardBorderBg: 'border-border bg-card',
      iconBox: 'bg-info-bg border-info',
      iconColor: 'text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'bg-info-bg border-info text-info-text',
      trendColor: 'text-info-text',
    };
  }
  if (t.includes('expense') || t.includes('loss') || t.includes('due') || t.includes('alert')) {
    return {
      cardBorderBg: 'border-border bg-card',
      iconBox: 'bg-danger-bg border-danger',
      iconColor: 'text-danger-text',
      strokeColor: 'var(--chart-danger)',
      badgeBg: 'bg-danger-bg border-danger text-danger-text',
      trendColor: 'text-danger-text',
    };
  }
  return {
    cardBorderBg: 'border-border bg-card',
    iconBox: 'bg-primary-subtle border-border-focus',
    iconColor: 'text-primary',
    strokeColor: 'var(--chart-primary)',
    badgeBg: 'bg-primary-subtle border-border-focus text-primary',
    trendColor: 'text-primary',
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
            className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-slow hover:shadow-popover flex flex-col justify-between ${theme.cardBorderBg}`}
          >
            <svg
              aria-hidden="true"
              className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-safe:duration-xslow pointer-events-none"
              viewBox="0 0 150 45"
            >
              <path d={sparklinePath} fill="none" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
            </svg>

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-xs sm:text-sm font-semibold text-text-secondary uppercase tracking-wider truncate">
                    {kpi.title}
                  </span>
                  {kpi.periodBadge && (
                    <span className={`self-start rounded-full px-2 py-0.5 text-micro font-bold border shadow-card ${theme.badgeBg}`}>
                      {kpi.periodBadge}
                    </span>
                  )}
                </div>
                <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${theme.iconBox}`}>
                  <KpiIcon size={18} strokeWidth={2.2} className={theme.iconColor} aria-hidden="true" />
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-text-primary tabular-nums">
                {kpi.value}
              </p>
              <p className="mt-1 text-xs text-text-secondary truncate">{kpi.subtext}</p>
            </div>

            <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
              <TrendingUp size={13} className={theme.trendColor} aria-hidden="true" />
              <span className={`text-xs font-semibold ${theme.trendColor}`}>{kpi.trend}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
