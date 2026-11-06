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

export function AdminFinanceDashboardKpiCards({ statCards, isLoading }: AdminFinanceDashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {isLoading
        ? Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i + 1}`} className="rounded-xl border border-border bg-card p-5 shadow-card space-y-3">
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-4 w-28" />
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-8 w-20" />
              <div className="motion-safe:animate-pulse rounded-sm bg-skeleton-base h-3 w-24" />
            </div>
          ))
        : statCards.map(({ label, value, icon: Icon, sub, color, periodBadge }) => (
            <div
              key={label}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    {label}
                  </span>
                  {periodBadge && (
                    <span className="rounded-md bg-primary-subtle px-1.5 py-0.5 text-[10px] font-bold text-primary tracking-wide">
                      {periodBadge}
                    </span>
                  )}
                </div>
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  color === 'emerald' ? 'bg-success-bg text-success-text' :
                  color === 'blue' ? 'bg-info-bg text-info-text' :
                  color === 'amber' ? 'bg-warning-bg text-warning-text' :
                  color === 'rose' ? 'bg-danger-bg text-danger-text' :
                  'bg-primary-subtle text-primary'
                }`}>
                  <Icon size={18} strokeWidth={2.2} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                {value}
              </p>
              {sub && <div className="mt-2 flex items-center">{sub}</div>}
            </div>
          ))}
    </div>
  );
}

export default AdminFinanceDashboardKpiCards;

