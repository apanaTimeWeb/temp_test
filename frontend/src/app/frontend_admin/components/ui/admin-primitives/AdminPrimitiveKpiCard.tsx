/** Zero-business KPI card shared by admin modules with rich colorful gradients and sparklines matching Superadmin UI. */
import type { AdminSystemKpiCardProps } from '@/app/frontend_admin/components/ui/admin-primitives/types/AdminUiAdminPrimitivesComponentTypes';
import { Minus,TrendingDown,TrendingUp } from 'lucide-react';

function joinClasses(...values: Array<string | null | undefined | false>): string {
  return values.filter((value): value is string => typeof value === 'string' && value.length > 0).join(' ');
}

// Generates decorative SVG sparkline path like Superadmin Dashboard
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

interface KpiThemeConfig {
  cardBorderBg: string;
  iconBox: string;
  iconColor: string;
  strokeColor: string;
  badge: string;
  borderHover: string;
}

function resolveTheme(title: string): KpiThemeConfig {
  const t = (title || '').toLowerCase();
  if (t.includes('revenue') || t.includes('collection') || t.includes('paid') || t.includes('profit') || t.includes('cash') || t.includes('cleared')) {
    return {
      cardBorderBg: 'border-emerald-500/25 bg-gradient-to-br from-[#091a16]/95 via-[#091a16]/90 to-[#0e2721]/80 shadow-emerald-950/30',
      iconBox: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      iconColor: 'text-emerald-400',
      strokeColor: '#34d399',
      badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      borderHover: 'hover:border-emerald-500/50',
    };
  }
  if (t.includes('expense') || t.includes('loss') || t.includes('due') || t.includes('late') || t.includes('discrepancy') || t.includes('flagged') || t.includes('alert')) {
    return {
      cardBorderBg: 'border-rose-500/25 bg-gradient-to-br from-[#1f0a10]/95 via-[#1f0a10]/90 to-[#2d0e17]/80 shadow-rose-950/30',
      iconBox: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      iconColor: 'text-rose-400',
      strokeColor: '#f87171',
      badge: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
      borderHover: 'hover:border-rose-500/50',
    };
  }
  if (t.includes('member') || t.includes('student') || t.includes('user') || t.includes('visitor') || t.includes('active')) {
    return {
      cardBorderBg: 'border-sky-500/25 bg-gradient-to-br from-[#0c1828]/95 via-[#0c1828]/90 to-[#122238]/80 shadow-sky-950/30',
      iconBox: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
      iconColor: 'text-sky-400',
      strokeColor: '#38bdf8',
      badge: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
      borderHover: 'hover:border-sky-500/50',
    };
  }
  if (t.includes('seat') || t.includes('occupan') || t.includes('locker') || t.includes('desk') || t.includes('capacity')) {
    return {
      cardBorderBg: 'border-cyan-500/25 bg-gradient-to-br from-[#081822]/95 via-[#081822]/90 to-[#0d2636]/80 shadow-cyan-950/30',
      iconBox: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      iconColor: 'text-cyan-400',
      strokeColor: '#22d3ee',
      badge: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      borderHover: 'hover:border-cyan-500/50',
    };
  }
  if (t.includes('staff') || t.includes('attend') || t.includes('shift') || t.includes('payroll') || t.includes('employee')) {
    return {
      cardBorderBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30',
      iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
      iconColor: 'text-indigo-400',
      strokeColor: '#818cf8',
      badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      borderHover: 'hover:border-indigo-500/50',
    };
  }
  if (t.includes('pending') || t.includes('waiting') || t.includes('branch') || t.includes('plan') || t.includes('coupon') || t.includes('gold') || t.includes('asset') || t.includes('value')) {
    return {
      cardBorderBg: 'border-amber-500/25 bg-gradient-to-br from-[#1c1408]/95 via-[#1c1408]/90 to-[#2c200c]/80 shadow-amber-950/30',
      iconBox: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      iconColor: 'text-amber-400',
      strokeColor: '#fbbf24',
      badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      borderHover: 'hover:border-amber-500/50',
    };
  }
  return {
    cardBorderBg: 'border-indigo-500/25 bg-gradient-to-br from-[#0c0f28]/95 via-[#0c0f28]/90 to-[#12163a]/80 shadow-indigo-950/30',
    iconBox: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400',
    iconColor: 'text-indigo-400',
    strokeColor: '#818cf8',
    badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    borderHover: 'hover:border-indigo-500/50',
  };
}

export function AdminSystemKpiCard({ title, value, subtitle, icon, trend, trendLabel, className }: AdminSystemKpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendClass = trend === 'up' ? 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/30' : trend === 'down' ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30' : 'text-slate-300 bg-slate-500/15 border border-slate-500/30';

  const theme = resolveTheme(title || '');
  const sparklinePath = generateSparkline(title || 'kpi');

  return (
    <div
      className={joinClasses(
        'group relative overflow-hidden min-w-0 rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.01] hover:shadow-xl',
        theme.cardBorderBg,
        theme.borderHover,
        className
      )}
    >
      {/* Decorative sparkline using theme accent color matching Superadmin UI */}
      <svg
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none"
        viewBox="0 0 150 45"
      >
        <path d={sparklinePath} fill="none" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="relative z-10 flex items-start justify-between gap-2">
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300 truncate">{title}</span>
        {icon && (
          <div
            className={joinClasses(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform duration-200 group-hover:scale-110',
              theme.iconBox
            )}
            aria-hidden="true"
          >
            {typeof icon === 'string' ? <span className="text-lg">{icon}</span> : icon}
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3 sm:mt-4">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums text-white tracking-tight">
          {value}
        </div>

        {(subtitle || trend || trendLabel) && (
          <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2.5 border-t border-white/10 text-xs">
            {(trend || trendLabel) && (
              <span className={joinClasses('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs', trendClass)}>
                {trend && <TrendIcon size={12} aria-hidden="true" />}
                {trendLabel && <span>{trendLabel}</span>}
              </span>
            )}
            {subtitle && <span className="text-xs font-medium text-slate-400 truncate">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSystemKpiCard;
export type { AdminSystemKpiCardProps };
