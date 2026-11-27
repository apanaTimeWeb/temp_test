'use client';

import { AlertOctagon, Armchair, CheckCircle2, Wrench } from 'lucide-react';

interface AdminSeatsManagementKpiGridProps {
  total: number;
  working: number;
  maintenance: number;
  broken: number;
  branchLabel: string;
}

export function AdminSeatsManagementKpiGrid({
  total,
  working,
  maintenance,
  broken,
  branchLabel,
}: AdminSeatsManagementKpiGridProps) {
  const cards = [
    {
      label: 'Total Inventory',
      value: total,
      footer: branchLabel,
      valueCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      stroke: 'var(--chart-info)',
      Icon: Armchair,
    },
    {
      label: 'Working Desks',
      value: working,
      footer: 'Fully operational',
      valueCls: 'text-success-text',
      iconCls: 'border-success bg-success-bg text-success-text',
      stroke: 'var(--chart-success)',
      Icon: CheckCircle2,
    },
    {
      label: 'Maintenance',
      value: maintenance,
      footer: 'Scheduled repairs',
      valueCls: 'text-warning-text',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      stroke: 'var(--chart-warning)',
      Icon: Wrench,
    },
    {
      label: 'Out of Order',
      value: broken,
      footer: 'Defective / broken',
      valueCls: 'text-danger-text',
      iconCls: 'border-danger bg-danger-bg text-danger-text',
      stroke: 'var(--chart-danger)',
      Icon: AlertOctagon,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.Icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 pointer-events-none" viewBox="0 0 150 45">
              <path d="M0,32 Q25,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={card.stroke} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 flex items-start justify-between gap-2">
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary">{card.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${card.iconCls}`}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <p className={`relative z-10 mt-3 sm:mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight tabular-nums ${card.valueCls}`}>
              {card.value}
            </p>
            <p className="relative z-10 mt-3.5 pt-2.5 border-t border-border text-xs font-medium text-text-secondary">
              {card.footer}
            </p>
          </div>
        );
      })}
    </div>
  );
}
