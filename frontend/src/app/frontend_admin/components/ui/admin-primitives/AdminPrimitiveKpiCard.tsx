/** Zero-business KPI card shared by admin modules. */
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { AdminSystemKpiCardProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';


function joinClasses(...values: Array<string | null | undefined | false>): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

export function AdminSystemKpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: AdminSystemKpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass = trend === 'up' ? 'text-success-text' : trend === 'down' ? 'text-danger-text' : '';

  return (
    <div className={joinClasses('min-w-0 rounded-xl border border-border bg-card p-4 shadow-card', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">{title}</span>
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-subtle text-primary" aria-hidden="true">
            {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold tabular-nums text-primary mt-1">{value}</div>
      {(subtitle || trend || trendLabel) && (
        <div className="mt-1 flex items-center gap-2">
          {trend && <TrendIcon size={14} aria-hidden="true" className={joinClasses('inline-flex items-center gap-1 text-xs font-medium', trendClass)} />}
          {trendLabel && <span className={joinClasses('inline-flex items-center gap-1 text-xs font-medium', trendClass)}>{trendLabel}</span>}
          {subtitle && <span className="text-xs text-text-secondary">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default AdminSystemKpiCard;


export type { AdminSystemKpiCardProps };
