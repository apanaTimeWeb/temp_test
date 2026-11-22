'use client';
/** Responsibility: Superadmin Dashboard Top KPIs Grid; displays the 12 platform overview KPI metrics with click-through navigation. */
import type { SuperadminDashboardOverviewKpiCard as KpiCardType } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import SuperadminDashboardOverviewKpiCard from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewKpiCard';

interface SuperadminDashboardOverviewTopKpisProps {
  cards: KpiCardType[];
}

export default function SuperadminDashboardOverviewTopKpis({ cards }: SuperadminDashboardOverviewTopKpisProps) {
  return (
    <section aria-label="12 Platform Overview Key Performance Indicators" className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <span>Platform Key Metrics (12 Essential KPIs)</span>
          <span className="text-[11px] font-medium text-slate-400 lowercase">(click any card to view detailed list)</span>
        </h2>
        <span className="text-xs text-indigo-400 font-semibold hidden sm:inline-block">
          Auto-synchronized
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((kpi) => (
          <SuperadminDashboardOverviewKpiCard
            key={kpi.title || kpi.icon}
            {...kpi}
          />
        ))}
      </div>
    </section>
  );
}
