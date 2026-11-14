/** Responsibility: Superadmin Dashboard System Health Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminDashboardOverviewSystemHealthPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

import type { SuperadminDashboardSystemHealth as SystemHealth, SuperadminDashboardSystemHealthPanelProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';
import { SUPERADMIN_DASHBOARD_HEALTH_METRICS } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewHealthConstants';



// Map each metric key to its CSS colour class — no inline style needed


/**
 * Performs the superadmin dashboard overview system health panel operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminDashboardSystemHealthPanelProps.
 */
export default function SuperadminDashboardOverviewSystemHealthPanel({ data }: SuperadminDashboardSystemHealthPanelProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <div className="col-span-12 lg:col-span-7 sa-card flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-base font-bold text-primary">{t("COPY.SYSTEM_HEALTH")}</h2>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
        {SUPERADMIN_DASHBOARD_HEALTH_METRICS.map(({ key, labelKey, icon: Icon, colorCls }) => (
          <div key={key} className="sa-health-metric-card">
            <div className="sa-health-metric-header">
              <Icon size={16} className={colorCls} />
              <span className="sa-health-metric-label">{t(labelKey)}</span>
            </div>
            <span className={`sa-health-metric-value ${colorCls}`}>
              {(() => { const value = data[key as keyof SystemHealth]; return value === null || value === undefined || value === '' ? '—' : String(value); })()}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <Link href={__SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SYSTEM_HEALTH} className="sa-panel-view-all" data-testid="superadmin-dashboard-dashboard_overview-link-1">
          <ExternalLink size={13} /> {t("COPY.VIEW_FULL_SYSTEM_REPORT")}
        </Link>
      </div>
    </div>
  );
}
