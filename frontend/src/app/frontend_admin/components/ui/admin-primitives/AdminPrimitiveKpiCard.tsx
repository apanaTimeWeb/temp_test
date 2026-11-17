/** Zero-business KPI card shared by admin modules with colorful semantic badges. */
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { AdminSystemKpiCardProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';

function joinClasses(...values: Array<string | null | undefined | false>): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

export function AdminSystemKpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: AdminSystemKpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass = trend === 'up' ? 'text-emerald-400 bg-emerald-500/10' : trend === 'down' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 bg-slate-500/10';

  // Determine vibrant accent theme by title keywords
  const titleLower = (title || '').toLowerCase();
  const theme = 
    titleLower.includes('revenue') || titleLower.includes('collection') || titleLower.includes('paid') || titleLower.includes('profit')
      ? { badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', border: 'hover:border-emerald-500/40' }
      : titleLower.includes('expense') || titleLower.includes('loss') || titleLower.includes('due') || titleLower.includes('late')
      ? { badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30', border: 'hover:border-rose-500/40' }
      : titleLower.includes('member') || titleLower.includes('student') || titleLower.includes('user')
      ? { badge: 'bg-sky-500/15 text-sky-400 border border-sky-500/30', border: 'hover:border-sky-500/40' }
      : titleLower.includes('seat') || titleLower.includes('occupan') || titleLower.includes('locker')
      ? { badge: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30', border: 'hover:border-cyan-500/40' }
      : titleLower.includes('staff') || titleLower.includes('attend') || titleLower.includes('shift')
      ? { badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30', border: 'hover:border-indigo-500/40' }
      : titleLower.includes('branch') || titleLower.includes('plan') || titleLower.includes('coupon')
      ? { badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', border: 'hover:border-amber-500/40' }
      : { badge: 'bg-primary-subtle text-primary border border-primary/20', border: 'hover:border-primary/40' };

  return (
    <div className={joinClasses('min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg', theme.border, className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary truncate">{title}</span>
        {icon && (
          <div className={joinClasses('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 hover:scale-105', theme.badge)} aria-hidden="true">
            {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
          </div>
        )}
      </div>
      <div className="text-2xl sm:text-3xl font-black tabular-nums text-text-primary tracking-tight mt-2">{value}</div>
      {(subtitle || trend || trendLabel) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-2 border-t border-border/50 text-xs">
          {(trend || trendLabel) && (
            <span className={joinClasses('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[11px]', trendClass)}>
              {trend && <TrendIcon size={12} aria-hidden="true" />}
              {trendLabel && <span>{trendLabel}</span>}
            </span>
          )}
          {subtitle && <span className="text-text-secondary truncate">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default AdminSystemKpiCard;
export type { AdminSystemKpiCardProps };
