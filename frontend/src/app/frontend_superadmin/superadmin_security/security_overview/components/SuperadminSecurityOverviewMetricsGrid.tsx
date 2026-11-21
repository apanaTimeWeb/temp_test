// components/SuperadminSecurityOverviewMetricsGrid.tsx
// RESPONSIBILITY: Render KPI security metrics grid with visual progress indicators and status badges.
'use client';

import React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface SecurityMetricItem {
  id: string;
  label: string;
  count: number;
  icon: LucideIcon;
  theme: string;
  bgGlow: string;
  borderColor: string;
  iconBoxBg: string;
  barColor: string;
  badge: string;
  badgeClass: string;
}

interface SuperadminSecurityOverviewMetricsGridProps {
  metrics: SecurityMetricItem[];
}

export const SuperadminSecurityOverviewMetricsGrid: React.FC<
  SuperadminSecurityOverviewMetricsGridProps
> = ({ metrics }) => {
  return (
    <section aria-label="Security Metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <article
            key={metric.id}
            className={`relative overflow-hidden rounded-2xl border ${metric.borderColor} bg-gradient-to-b ${metric.bgGlow} bg-[#0c0f2b]/95 p-5 shadow-xl backdrop-blur-xl transition-all duration-200 hover:shadow-2xl hover:border-opacity-60`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {metric.label}
              </span>
              <div className={`p-2 rounded-xl ${metric.iconBoxBg}`}>
                <Icon size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-3xl font-extrabold text-slate-100 tabular-nums">
                {metric.count}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${metric.badgeClass}`}
              >
                {metric.badge}
              </span>
            </div>

            <div className="mt-4">
              <div className="h-1.5 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metric.barColor}`}
                  style={{ width: `${Math.min(100, Math.max(25, metric.count * 15))}%` }}
                />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
};
