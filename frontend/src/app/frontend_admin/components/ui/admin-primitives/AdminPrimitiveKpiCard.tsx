/** Zero-business KPI card shared by admin modules with semantic theme tokens and motion-safe styling. */
import type { AdminSystemKpiCardProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';

function joinClasses(...values: Array<string | null | undefined | false>): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

const generateSparkline = (title: string) =>
  `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;

interface KpiThemeConfig {
  cardBorderBg: string;
  iconBox: string;
  strokeClass: string;
  borderHover: string;
}

function resolveTheme(title: string): KpiThemeConfig {
  const t = (title || '').toLowerCase();
  if (t.includes('revenue') || t.includes('collection') || t.includes('paid') || t.includes('profit') || t.includes('cash') || t.includes('cleared')) {
    return { cardBorderBg: 'border-success bg-card', iconBox: 'bg-success-bg border-success text-success-text', strokeClass: 'text-success', borderHover: 'hover:border-primary' };
  }
  if (t.includes('expense') || t.includes('loss') || t.includes('due') || t.includes('late') || t.includes('discrepancy') || t.includes('flagged') || t.includes('alert')) {
    return { cardBorderBg: 'border-danger bg-card', iconBox: 'bg-danger-bg border-danger text-danger-text', strokeClass: 'text-danger', borderHover: 'hover:border-primary' };
  }
  if (t.includes('member') || t.includes('student') || t.includes('user') || t.includes('visitor') || t.includes('active') || t.includes('seat') || t.includes('occupan') || t.includes('locker') || t.includes('desk') || t.includes('capacity')) {
    return { cardBorderBg: 'border-info bg-card', iconBox: 'bg-info-bg border-info text-info-text', strokeClass: 'text-info', borderHover: 'hover:border-primary' };
  }
  if (t.includes('pending') || t.includes('waiting') || t.includes('branch') || t.includes('plan') || t.includes('coupon') || t.includes('gold') || t.includes('asset') || t.includes('value')) {
    return { cardBorderBg: 'border-warning bg-card', iconBox: 'bg-warning-bg border-warning text-warning-text', strokeClass: 'text-warning', borderHover: 'hover:border-primary' };
  }
  return { cardBorderBg: 'border-primary bg-card', iconBox: 'bg-info-bg border-primary text-primary-text', strokeClass: 'text-primary', borderHover: 'hover:border-primary' };
}

export function AdminSystemKpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: AdminSystemKpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass =
    trend === 'up'
      ? 'text-success-text bg-success-bg border border-success'
      : trend === 'down'
        ? 'text-danger-text bg-danger-bg border border-danger'
        : 'text-text-secondary bg-surface border border-border';

  const theme = resolveTheme(title || '');
  const sparklinePath = generateSparkline(title || 'kpi');

  return (
    <div
      className={joinClasses(
        'group relative overflow-hidden min-w-0 rounded-2xl border p-5 sm:p-6 shadow-md motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:scale-[1.01] hover:shadow-xl',
        theme.cardBorderBg,
        theme.borderHover,
        className
      )}
    >
      <svg
        aria-hidden="true"
        className={joinClasses(
          'absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-safe:duration-500 pointer-events-none',
          theme.strokeClass
        )}
        viewBox="0 0 150 45"
      >
        <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative z-10 flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-text-secondary truncate">{title}</span>
        {icon && (
          <div
            className={joinClasses(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:scale-110',
              theme.iconBox
            )}
            aria-hidden="true"
          >
            {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 sm:mt-4">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums text-text-primary tracking-tight">
          {value}
        </div>

        {(subtitle || trend || trendLabel) && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-border text-xs">
            {(trend || trendLabel) && (
              <span className={joinClasses('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs', trendClass)}>
                {trend && <TrendIcon size={12} aria-hidden="true" />}
                {trendLabel && <span>{trendLabel}</span>}
              </span>
            )}
            {subtitle && <span className="text-xs font-medium text-text-secondary truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSystemKpiCard;
export type { AdminSystemKpiCardProps };
