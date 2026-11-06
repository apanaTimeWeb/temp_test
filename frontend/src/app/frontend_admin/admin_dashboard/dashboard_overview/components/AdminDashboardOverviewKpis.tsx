'use client';

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

export function AdminDashboardOverviewKpis({ kpis, sectionLabel }: AdminDashboardOverviewKpisProps) {
  return (
    <section aria-label={sectionLabel} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const KpiIcon = kpi.Icon;
        return (
          <article
            key={kpi.id}
            className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{kpi.title}</span>
                {kpi.periodBadge && (
                  <span className="rounded-md bg-success-bg px-1.5 py-0.5 text-[10px] font-bold text-success-text">
                    {kpi.periodBadge}
                  </span>
                )}
              </div>
              <div className={`p-2 rounded-xl border ${kpi.theme}`}>
                <KpiIcon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-text-primary">{kpi.value}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary border-t border-border pt-2">
              <span>{kpi.subtext}</span>
              <span className="font-semibold text-success-text">{kpi.trend}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AdminDashboardOverviewKpis;

