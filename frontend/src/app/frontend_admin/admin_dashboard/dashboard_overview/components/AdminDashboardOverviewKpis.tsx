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
    <section aria-label={sectionLabel} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi) => {
        const KpiIcon = kpi.Icon;
        return (
          <article
            key={kpi.id}
            className="rounded-2xl border border-indigo-500/20 bg-card p-5 sm:p-5.5 shadow-card transition-all hover:border-indigo-500/40 hover:shadow-lg hover:-translate-y-0.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">{kpi.title}</span>
                  {kpi.periodBadge && (
                    <span className="self-start rounded-md bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {kpi.periodBadge}
                    </span>
                  )}
                </div>
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-sm ${kpi.theme}`}>
                  <KpiIcon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-3.5 flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-white tabular-nums">{kpi.value}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-indigo-500/15 pt-2.5">
              <span className="truncate mr-2">{kpi.subtext}</span>
              <span className="font-semibold text-emerald-400 shrink-0">{kpi.trend}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default AdminDashboardOverviewKpis;
