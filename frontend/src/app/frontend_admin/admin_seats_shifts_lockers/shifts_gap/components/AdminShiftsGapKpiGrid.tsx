'use client';

import { Armchair, Clock, IndianRupee, TrendingDown } from 'lucide-react';

interface AdminShiftsGapKpiGridProps {
  totalShifts: number;
  avgGapPct: number;
  totalGapSeats: number;
  estRevLoss: number;
}

export function AdminShiftsGapKpiGrid({
  totalShifts,
  avgGapPct,
  totalGapSeats,
  estRevLoss,
}: AdminShiftsGapKpiGridProps) {
  const cards = [
    {
      label: 'Shifts Analyzed',
      value: totalShifts,
      badge: 'Active Schedules',
      valueCls: 'text-text-primary',
      iconCls: 'border-info bg-info-bg text-info-text',
      badgeCls: 'border-info bg-info-bg text-info-text',
      stroke: 'var(--chart-info)',
      Icon: Clock,
    },
    {
      label: 'Average Idle Gap',
      value: `${avgGapPct}%`,
      badge: 'Unoccupied Capacity',
      valueCls: 'text-warning-text',
      iconCls: 'border-warning bg-warning-bg text-warning-text',
      badgeCls: 'border-warning bg-warning-bg text-warning-text',
      stroke: 'var(--chart-warning)',
      Icon: TrendingDown,
    },
    {
      label: 'Unassigned Desks',
      value: totalGapSeats,
      badge: 'Available To Fill',
      valueCls: 'text-primary',
      iconCls: 'border-border-focus bg-primary-subtle text-primary',
      badgeCls: 'border-border-focus bg-primary-subtle text-primary',
      stroke: 'var(--chart-primary)',
      Icon: Armchair,
    },
    {
      label: 'Daily Idle Leak',
      value: `₹${estRevLoss.toLocaleString('en-IN')}`,
      badge: 'Recoverable Opportunity',
      valueCls: 'text-danger-text',
      iconCls: 'border-danger bg-danger-bg text-danger-text',
      badgeCls: 'border-danger bg-danger-bg text-danger-text',
      stroke: 'var(--chart-danger)',
      Icon: IndianRupee,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
      {cards.map((card) => {
        const Icon = card.Icon;
        return (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:scale-[1.01]"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute right-0 bottom-0 h-16 w-36 opacity-20 overflow-visible motion-safe:transition-opacity group-hover:opacity-40"
              viewBox="0 0 150 40"
              fill="none"
            >
              <path d="M0,32 Q15,18 55,24 T95,14 T130,20 T150,8" fill="none" stroke={card.stroke} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <div className="relative flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{card.label}</span>
              <div className={`p-2.5 rounded-xl border shrink-0 motion-safe:transition-transform motion-safe:group-hover:scale-110 shadow-card ${card.iconCls}`}>
                <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
              </div>
            </div>
            <p className={`mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums ${card.valueCls}`}>{card.value}</p>
            <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
              <span className={`inline-flex items-center gap-1 font-semibold rounded-full px-2 py-0.5 border ${card.badgeCls}`}>
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
