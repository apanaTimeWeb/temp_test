'use client';
/** Responsibility: Superadmin Dashboard System Health Panel; renders system health metrics with rich colors, icons, and action links. */
import Link from 'next/link';
import { ExternalLink, Activity, CheckCircle, Users, Zap, HardDrive } from 'lucide-react';
import type { SuperadminDashboardSystemHealth as SystemHealth, SuperadminDashboardSystemHealthPanelProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';

interface HealthMetricConfig {
  key: keyof SystemHealth;
  labelKey: string;
  icon: typeof CheckCircle;
  iconBox: string;
  iconColor: string;
  valueColor: string;
  cardBorderBg: string;
}

const HEALTH_CONFIGS: HealthMetricConfig[] = [
  {
    key: 'uptime',
    labelKey: 'COPY.SAMPLE_UPTIME',
    icon: CheckCircle,
    iconBox: 'bg-emerald-500/15 border-emerald-500/30',
    iconColor: 'text-emerald-400',
    valueColor: 'text-emerald-400',
    cardBorderBg: 'border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10',
  },
  {
    key: 'activeUsers',
    labelKey: 'COPY.SAMPLE_ACTIVE_USERS',
    icon: Users,
    iconBox: 'bg-indigo-500/15 border-indigo-500/30',
    iconColor: 'text-indigo-400',
    valueColor: 'text-indigo-300',
    cardBorderBg: 'border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10',
  },
  {
    key: 'apiLatency',
    labelKey: 'COPY.SAMPLE_API_LATENCY',
    icon: Zap,
    iconBox: 'bg-sky-500/15 border-sky-500/30',
    iconColor: 'text-sky-400',
    valueColor: 'text-sky-300',
    cardBorderBg: 'border-sky-500/20 bg-sky-500/5 hover:bg-sky-500/10',
  },
  {
    key: 'lastBackup',
    labelKey: 'COPY.SAMPLE_LAST_BACKUP',
    icon: HardDrive,
    iconBox: 'bg-purple-500/15 border-purple-500/30',
    iconColor: 'text-purple-400',
    valueColor: 'text-purple-300',
    cardBorderBg: 'border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10',
  },
];

/**
 * Performs the superadmin dashboard overview system health panel operation within dashboard overview.
 */
export default function SuperadminDashboardOverviewSystemHealthPanel({ data }: SuperadminDashboardSystemHealthPanelProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');

  return (
    <div className="col-span-12 lg:col-span-7 rounded-2xl border border-indigo-500/25 bg-[#0c0f28]/95 shadow-md flex flex-col justify-between overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-border/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Activity size={18} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">{t("COPY.SYSTEM_HEALTH")}</h2>
            <p className="text-xs text-slate-400">Live operational & infrastructure telemetry</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Operational</span>
        </div>
      </div>

      {/* Grid of metrics */}
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
        {HEALTH_CONFIGS.map(({ key, labelKey, icon: Icon, iconBox, iconColor, valueColor, cardBorderBg }) => {
          const rawValue = data?.[key];
          const displayVal = rawValue === null || rawValue === undefined || rawValue === '' ? '—' : String(rawValue);

          return (
            <div key={key} className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-200 ${cardBorderBg}`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{t(labelKey)}</span>
                <div className={`p-2 rounded-lg border ${iconBox}`}>
                  <Icon size={16} className={iconColor} />
                </div>
              </div>
              <span className={`text-xl sm:text-2xl font-black tracking-tight ${valueColor} break-words`}>
                {displayVal}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="p-5 sm:p-6 border-t border-border/80 flex items-center justify-between gap-3 bg-[#0a0d22]/50">
        <span className="text-xs text-slate-400">All primary cloud microservices healthy</span>
        <Link
          href={SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SYSTEM_HEALTH}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-xs font-semibold text-indigo-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-400 transition-all shadow-sm active:scale-95 cursor-pointer"
          data-testid="superadmin-dashboard-dashboard_overview-link-1"
        >
          <ExternalLink size={13} className="text-indigo-400" />
          <span>{t("COPY.VIEW_FULL_SYSTEM_REPORT")}</span>
        </Link>
      </div>
    </div>
  );
}
