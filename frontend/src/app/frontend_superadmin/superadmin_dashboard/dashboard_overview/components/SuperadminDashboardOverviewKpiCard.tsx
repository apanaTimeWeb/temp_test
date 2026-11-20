'use client';
/** Responsibility: Superadmin Dashboard Kpi Card; renders interactive KPI metrics with rich jewel color themes, badges, icons, sparklines, and click-through navigation. */
import Link from 'next/link';
import { TrendingUp, AlertTriangle, ChartColumn, ArrowUpRight } from 'lucide-react';
import type { SuperadminDashboardOverviewKpiCard as SuperadminDashboardKpiCardData } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { useLocale, useTranslations } from 'next-intl';

import { SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants';
import { FormatCompactCurrency } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/utils/SuperadminDashboardOverviewFormatters';

// Generates an SVG sparkline path
const generateSparkline = (title: string) => {
  return `M0,32 Q${15 + (title.length % 10)},${42 - (title.length % 15)} ${35 + (title.length % 10)},22 T${75 + (title.length % 10)},26 T${115 + (title.length % 10)},12 T150,6`;
};

interface KpiThemeConfig {
  cardBorderBg: string;
  iconBox: string;
  iconColor: string;
  strokeColor: string;
  progressGradient: string;
}

const THEME_PALETTES: Record<string, KpiThemeConfig> = {
  indigo: {
    cardBorderBg: 'border-indigo-500/40 bg-gradient-to-br from-indigo-950/80 via-[#1a1f4e] to-indigo-900/60 shadow-lg shadow-indigo-950/50 hover:border-indigo-400',
    iconBox: 'bg-indigo-500/20 border-indigo-500/40',
    iconColor: 'text-indigo-400',
    strokeColor: '#818cf8',
    progressGradient: 'from-indigo-500 to-indigo-400',
  },
  emerald: {
    cardBorderBg: 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 via-[#0f2d22] to-emerald-900/60 shadow-lg shadow-emerald-950/50 hover:border-emerald-400',
    iconBox: 'bg-emerald-500/20 border-emerald-500/40',
    iconColor: 'text-emerald-400',
    strokeColor: '#34d399',
    progressGradient: 'from-emerald-500 to-emerald-400',
  },
  amber: {
    cardBorderBg: 'border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-[#2d1f08] to-amber-900/60 shadow-lg shadow-amber-950/50 hover:border-amber-400',
    iconBox: 'bg-amber-500/20 border-amber-500/40',
    iconColor: 'text-amber-400',
    strokeColor: '#fbbf24',
    progressGradient: 'from-amber-500 to-amber-400',
  },
  rose: {
    cardBorderBg: 'border-rose-500/40 bg-gradient-to-br from-rose-950/80 via-[#2d0f18] to-rose-900/60 shadow-lg shadow-rose-950/50 hover:border-rose-400',
    iconBox: 'bg-rose-500/20 border-rose-500/40',
    iconColor: 'text-rose-400',
    strokeColor: '#f87171',
    progressGradient: 'from-rose-500 to-rose-400',
  },
  sky: {
    cardBorderBg: 'border-sky-500/40 bg-gradient-to-br from-sky-950/80 via-[#0f2540] to-sky-900/60 shadow-lg shadow-sky-950/50 hover:border-sky-400',
    iconBox: 'bg-sky-500/20 border-sky-500/40',
    iconColor: 'text-sky-400',
    strokeColor: '#38bdf8',
    progressGradient: 'from-sky-500 to-sky-400',
  },
  cyan: {
    cardBorderBg: 'border-cyan-500/40 bg-gradient-to-br from-cyan-950/80 via-[#082930] to-cyan-900/60 shadow-lg shadow-cyan-950/50 hover:border-cyan-400',
    iconBox: 'bg-cyan-500/20 border-cyan-500/40',
    iconColor: 'text-cyan-400',
    strokeColor: '#22d3ee',
    progressGradient: 'from-cyan-500 to-cyan-400',
  },
  teal: {
    cardBorderBg: 'border-teal-500/40 bg-gradient-to-br from-teal-950/80 via-[#092b26] to-teal-900/60 shadow-lg shadow-teal-950/50 hover:border-teal-400',
    iconBox: 'bg-teal-500/20 border-teal-500/40',
    iconColor: 'text-teal-400',
    strokeColor: '#2dd4bf',
    progressGradient: 'from-teal-500 to-teal-400',
  },
  purple: {
    cardBorderBg: 'border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-[#271038] to-purple-900/60 shadow-lg shadow-purple-950/50 hover:border-purple-400',
    iconBox: 'bg-purple-500/20 border-purple-500/40',
    iconColor: 'text-purple-400',
    strokeColor: '#c084fc',
    progressGradient: 'from-purple-500 to-purple-400',
  },
  violet: {
    cardBorderBg: 'border-violet-500/40 bg-gradient-to-br from-violet-950/80 via-[#1e133e] to-violet-900/60 shadow-lg shadow-violet-950/50 hover:border-violet-400',
    iconBox: 'bg-violet-500/20 border-violet-500/40',
    iconColor: 'text-violet-400',
    strokeColor: '#a78bfa',
    progressGradient: 'from-violet-500 to-violet-400',
  },
};

const ICON_TO_THEME: Record<string, string> = {
  building: 'indigo',
  store: 'teal',
  check_circle: 'emerald',
  power_off: 'rose',
  git_branch: 'cyan',
  shield_check: 'purple',
  user_check: 'violet',
  groups: 'emerald',
  currency_rupee: 'amber',
  receipt: 'rose',
  pending_actions: 'amber',
  hard_drive: 'sky',
};

export default function SuperadminDashboardOverviewKpiCard({
  title,
  titleKey,
  value,
  valueMinor,
  currencyCode,
  icon,
  subtitle,
  subtitleKey,
  subtitleAmountMinor,
  subtitleCurrencyCode,
  trend,
  progress,
  alert,
  alertKey,
  href,
  colorTheme,
}: SuperadminDashboardKpiCardData) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  const locale = useLocale();

  const displayValue = valueMinor !== undefined && currencyCode ? FormatCompactCurrency(valueMinor, currencyCode, locale) : value;
  const displaySubtitle = subtitleAmountMinor !== undefined && subtitleCurrencyCode && subtitleKey
    ? t(subtitleKey, { amount: FormatCompactCurrency(subtitleAmountMinor, subtitleCurrencyCode, locale) })
    : subtitleKey ? t(subtitleKey) : subtitle;
  const displayTitle = titleKey ? t(titleKey) : title;
  const Icon = SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP[icon as keyof typeof SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP] ?? ChartColumn;
  const sparklinePath = generateSparkline(title);

  const themeKey = colorTheme ?? ICON_TO_THEME[icon] ?? 'indigo';
  const theme = THEME_PALETTES[themeKey] ?? THEME_PALETTES.indigo;

  const cardContent = (
    <div className={`sa-kpi-card group relative h-full overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-md transition-all duration-300 hover:scale-[1.015] hover:shadow-xl cursor-pointer ${theme.cardBorderBg}`}>
      {/* Decorative sparkline using theme-specific accent color */}
      <svg aria-hidden="true" className="absolute bottom-0 right-0 w-36 h-20 opacity-20 group-hover:opacity-35 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none" viewBox="0 0 150 45">
        <path d={sparklinePath} fill="none" stroke={theme.strokeColor} strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="flex items-start justify-between relative z-10 gap-3">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider truncate">{displayTitle}</p>
          {href && (
            <ArrowUpRight size={14} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          )}
        </div>
        <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-110 ${theme.iconBox}`}>
          <Icon aria-hidden="true" size={20} className={theme.iconColor} />
        </div>
      </div>

      <div className="relative z-10 mt-3 sm:mt-4">
        <p className="sa-kpi-value text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {displayValue || '—'}
        </p>

        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {trend && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
              <TrendingUp size={12} className="text-emerald-400" />
              <span>{trend}</span>
            </span>
          )}

          {alert && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-xs">
              <AlertTriangle size={12} className="text-rose-400" />
              <span>{alertKey ? t(alertKey) : alert}</span>
            </span>
          )}

          {(subtitle || (subtitleAmountMinor !== undefined && subtitleCurrencyCode)) && (
            <span className="text-xs font-medium text-slate-400">{displaySubtitle}</span>
          )}
        </div>

        {progress !== undefined && (
          <div className="mt-3.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Capacity Utilized</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r transition-all duration-700 ${theme.progressGradient}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={t("COPY.PROGRESS_FOR_NAME", { name: displayTitle })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full no-underline outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-2xl">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
