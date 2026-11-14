/** Responsibility: Superadmin Dashboard Kpi Card; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminDashboardOverviewKpiCard formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import { TrendingUp, AlertTriangle, ChartColumn } from 'lucide-react';
import type { SuperadminDashboardOverviewKpiCard as SuperadminDashboardKpiCardData } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { useLocale, useTranslations } from 'next-intl';

import { SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants';
import { FormatCompactCurrency } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/utils/SuperadminDashboardOverviewFormatters';



// Generates a mock SVG path based on title length for variety
const generateSparkline = (title: string) => {
  
  return `M0,30 Q${10 + title.length},${40 - title.length} ${30 + title.length},20 T${60 + title.length},25 T${100 + title.length},10 T140,5`;
};

/**
 * Performs the superadmin dashboard overview kpi card operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminDashboardKpiCardData.
 */
export default function SuperadminDashboardOverviewKpiCard({ title, titleKey, value, valueMinor, currencyCode, icon, subtitle, subtitleKey, subtitleAmountMinor, subtitleCurrencyCode, trend, progress, alert, alertKey }: SuperadminDashboardKpiCardData) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  const locale = useLocale();
  const displayValue = valueMinor !== undefined && currencyCode ? FormatCompactCurrency(valueMinor, currencyCode, locale) : value;
  const displaySubtitle = subtitleAmountMinor !== undefined && subtitleCurrencyCode && subtitleKey
    ? t(subtitleKey, { amount: FormatCompactCurrency(subtitleAmountMinor, subtitleCurrencyCode, locale) })
    : subtitleKey ? t(subtitleKey) : subtitle;
  const displayTitle = titleKey ? t(titleKey) : title;
  const Icon = SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP[icon as keyof typeof SUPERADMIN_DASHBOARD_KPI_CARD_ICON_MAP] ?? ChartColumn;
  const sparklinePath = generateSparkline(title);

  return (
    <div className="sa-kpi-card group relative overflow-hidden">
      {/* Decorative sparkline uses the global semantic primary token. */}
      <svg aria-hidden="true" className="absolute bottom-0 right-0 w-32 h-16 text-primary opacity-15 group-hover:opacity-30 motion-safe:transition-opacity motion-reduce:transition-none motion-safe:duration-500 pointer-events-none" viewBox="0 0 140 40">
        <path d={sparklinePath} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>

      <div className="flex items-start justify-between relative z-10">
        <p className="sa-label text-secondary">{displayTitle}</p>
        <Icon aria-hidden="true" size={24} className="shrink-0" />
      </div>

      <div className="relative z-10 mt-2">
        <p className="sa-kpi-value text-4xl font-extrabold tracking-tight text-primary">
          {displayValue}
        </p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {trend && (
            <span className="sa-trend-up px-2 py-1 bg-info-bg border border-border rounded-md shadow-sm">
              <TrendingUp size={12} className="text-info" /> 
              <span className="text-info font-bold">{trend}</span>
            </span>
          )}
          {(subtitle || (subtitleAmountMinor !== undefined && subtitleCurrencyCode)) && <span className="sa-kpi-subtitle font-medium text-secondary">{displaySubtitle}</span>}
          {alert && (
            <span className="sa-trend-alert bg-warning-bg border border-border rounded-md px-2 py-1 shadow-sm">
              <AlertTriangle size={12} className="text-warning" /> 
              <span className="text-warning font-bold">{alertKey ? t(alertKey) : alert}</span>
            </span>
          )}
          {progress !== undefined && (
            <div className="sa-progress-track w-full max-w-25 h-1.5 bg-card rounded-full overflow-hidden mt-1 shadow-inner">
              <progress className="sa-kpi-progress" max={100} value={progress} aria-label={t("COPY.PROGRESS_FOR_NAME", { name: displayTitle })} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
