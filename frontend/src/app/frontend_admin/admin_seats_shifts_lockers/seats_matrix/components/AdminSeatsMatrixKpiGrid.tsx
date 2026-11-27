'use client';

import { AlertTriangle, Armchair, CheckCircle2, Users } from 'lucide-react';

interface AdminSeatsMatrixKpiGridProps {
  total: number;
  free: number;
  occupied: number;
  expiringOrMaint: number;
  occupancyRate: number;
  activeBranchFilter: string;
}

export function AdminSeatsMatrixKpiGrid({
  total,
  free,
  occupied,
  expiringOrMaint,
  occupancyRate,
  activeBranchFilter,
}: AdminSeatsMatrixKpiGridProps) {
  const cards = [
    {
      label: 'Total Desks',
      value: total,
      footer: `${activeBranchFilter} capacity`,
      valueCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      stroke: 'var(--chart-info)',
      footerCls: 'text-text-secondary',
      Icon: Armchair,
    },
    {
      label: 'Available Free',
      value: free,
      footer: 'Ready for instant allocation',
      valueCls: 'text-success-text',
      iconCls: 'border-success bg-success-bg text-success-text',
      stroke: 'var(--chart-success)',
      footerCls: 'text-text-secondary',
      Icon: CheckCircle2,
    },
    {
      label: 'Occupied Desks',
      value: occupied,
      footer: `${occupancyRate}% seat utilization`,
      valueCls: 'text-text-primary',
      iconCls: 'border-border-focus bg-primary-subtle text-primary',
      stroke: 'var(--chart-primary)',
      footerCls: 'text-primary',
      Icon: Users,
    },
    {
      label: 'Maint. / Expiring',
      value: expiringOrMaint,
      footer: 'Action recommended',
      valueCls: 'text-warning-text',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      stroke: 'var(--chart-warning)',
      footerCls: 'text-text-secondary',
      Icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.Icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={card.stroke} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{card.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 shadow-card ${card.iconCls}`}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <p className={`relative z-10 mt-3 text-3xl font-extrabold tracking-tight tabular-nums ${card.valueCls}`}>{card.value}</p>
            <p className={`relative z-10 mt-3 pt-2 border-t border-border text-xs font-medium ${card.footerCls}`}>{card.footer}</p>
          </div>
        );
      })}
    </div>
  );
}
