'use client';

import { ADMIN_PLANS_STATUS_VALUES } from '@/app/frontend_admin/admin_members/members_plans/config/admin_members_plans.url_config';
import type { AdminPlansPlan } from '@/app/frontend_admin/admin_members/members_plans/schemas/AdminMembersPlansSchema';
import { CheckCircle, Clock, Layers, Users } from 'lucide-react';

interface AdminMembersPlansKpiGridProps {
  plans: readonly AdminPlansPlan[];
}

export function AdminMembersPlansKpiGrid({ plans }: AdminMembersPlansKpiGridProps) {
  const kpis = [
    {
      label: 'Total Plans',
      value: plans.length,
      icon: Layers,
      iconBox: 'bg-info-bg border-info text-info-text',
      strokeColor: 'var(--chart-info)',
      badgeBg: 'border-info bg-info-bg text-info-text',
      trend: 'Catalog Active',
    },
    {
      label: 'Active Plans',
      value: plans.filter((p) => p.status === ADMIN_PLANS_STATUS_VALUES[0]).length,
      icon: CheckCircle,
      iconBox: 'bg-success-bg border-success text-success-text',
      strokeColor: 'var(--chart-success)',
      badgeBg: 'border-success bg-success-bg text-success-text',
      trend: 'Live for Students',
    },
    {
      label: 'Avg Duration',
      value:
        plans.length > 0
          ? `${Math.round(plans.reduce((a, b) => a + (b.durationDays || 30), 0) / plans.length)} Days`
          : '30 Days',
      icon: Clock,
      iconBox: 'bg-warning-bg border-warning text-warning-text',
      strokeColor: 'var(--chart-warning)',
      badgeBg: 'border-warning bg-warning-bg text-warning-text',
      trend: 'Standard Term',
    },
    {
      label: 'Total Subscribers',
      value: plans.reduce((acc, p) => acc + (p.subscribers || 0), 0),
      icon: Users,
      iconBox: 'bg-purple-bg border-border text-purple',
      strokeColor: 'var(--chart-primary)',
      badgeBg: 'border-border bg-purple-bg text-purple',
      trend: 'Active Students',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
        >
          <svg
            aria-hidden="true"
            className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none"
            viewBox="0 0 150 45"
          >
            <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={kpi.strokeColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 flex items-start justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">{kpi.label}</span>
            <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${kpi.iconBox}`}>
              <kpi.icon size={18} strokeWidth={2.2} aria-hidden="true" />
            </div>
          </div>
          <div className="relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text-primary tabular-nums">
            {kpi.value}
          </div>
          <div className="relative z-10 mt-3.5 pt-2.5 border-t border-border flex items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold shadow-card ${kpi.badgeBg}`}>
              {kpi.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
