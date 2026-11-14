/** Responsibility: Superadmin System Kpi Card; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCard formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SuperadminSystemClassNameUtilities as cn } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/utils/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsClassNameUtilities';
import type { SuperadminSystemKpiCardProps } from '@/app/frontend_superadmin/superadmin_libraries/libraries_library_capacity_scaling_recommendations/types/SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCardComponentTypes';

/**
 * Performs the superadmin libraries overview library capacity scaling recommendations kpi card operation within libraries overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminSystemKpiCardProps.
 */
export function SuperadminLibrariesOverviewLibraryCapacityScalingRecommendationsKpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: SuperadminSystemKpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendCls = trend === 'up' ? 'sys-kpi-card__trend--up' : trend === 'down' ? 'sys-kpi-card__trend--down' : '';
  return (
    <div className={cn('sys-kpi-card', className)}>
      <div className="flex items-center justify-between"><span className="sys-kpi-card__label">{title}</span>{icon && <span className="text-2xl" aria-hidden="true">{icon}</span>}</div>
      <div className="sys-kpi-card__value">{value}</div>
      {(subtitle || trend) && <div className="flex items-center gap-2">
        {trend && <TrendIcon size={14} aria-hidden="true" className={cn('sys-kpi-card__trend', trendCls)} />}
        {trendLabel && <span className={cn('sys-kpi-card__trend', trendCls)}>{trendLabel}</span>}
        {subtitle && <span className="sys-kpi-card__subtitle">{subtitle}</span>}
      </div>}
    </div>
  );
}
