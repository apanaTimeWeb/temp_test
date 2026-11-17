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

const COLOR_STYLES: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  emerald: {
    border: 'border-emerald-500/20 hover:border-emerald-500/40',
    glow: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-linear-to-br from-emerald-500/5 via-card to-card',
  },
  blue: {
    border: 'border-cyan-500/20 hover:border-cyan-500/40',
    glow: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
    text: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-linear-to-br from-cyan-500/5 via-card to-card',
  },
  amber: {
    border: 'border-amber-500/20 hover:border-amber-500/40',
    glow: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-linear-to-br from-amber-500/5 via-card to-card',
  },
  rose: {
    border: 'border-rose-500/20 hover:border-rose-500/40',
    glow: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-linear-to-br from-rose-500/5 via-card to-card',
  },
};

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
        : statCards.map(({ label, value, icon: Icon, sub, color, periodBadge }) => {
            const style = COLOR_STYLES[color] ?? COLOR_STYLES.blue;
            return (
              <div
                key={label}
                className={`group relative overflow-hidden rounded-xl border ${style.border} ${style.bg} p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {label}
                    </span>
                    {periodBadge && (
                      <span className="rounded-md border border-border bg-surface-highlight px-1.5 py-0.5 text-[10px] font-bold text-primary tracking-wide">
                        {periodBadge}
                      </span>
                    )}
                  </div>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.glow}`}>
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                  {value}
                </p>
                {sub && <div className="mt-2 flex items-center">{sub}</div>}
              </div>
            );
          })}
    </div>
  );
}

export default AdminFinanceDashboardKpiCards;
