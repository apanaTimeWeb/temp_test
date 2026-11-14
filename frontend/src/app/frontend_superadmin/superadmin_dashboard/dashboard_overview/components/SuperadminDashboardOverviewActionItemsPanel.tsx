/** Responsibility: Superadmin Dashboard Action Items Panel; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminDashboardOverviewActionItemsPanel formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Lightbulb, ExternalLink } from 'lucide-react';

import type { SuperadminDashboardActionItemsPanelProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import { useTranslations } from 'next-intl';

import { SUPERADMIN_DASHBOARD_ACTION_ITEMS_PANEL_ICON_MAP } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewStaticConstants';





/**
 * Performs the superadmin dashboard overview action items panel operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminDashboardActionItemsPanelProps.
 */
export default function SuperadminDashboardOverviewActionItemsPanel({ data }: SuperadminDashboardActionItemsPanelProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <div className="col-span-12 lg:col-span-5 sa-card flex flex-col overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-base font-bold text-primary">{t("COPY.ACTION_ITEMS")}</h2>
      </div>

      <div className="p-6 space-y-3">
        {data.map((item, i) => {
          const isError = item.type === 'error';
          const Icon = SUPERADMIN_DASHBOARD_ACTION_ITEMS_PANEL_ICON_MAP[item.icon] ?? AlertTriangle;
          
          if (!item.actionUrl) {
            return (
              <div key={item.id} className={`sa-action-row ${isError ? 'sa-action-row--error' : 'sa-action-row--info'}`} aria-disabled="true">
                <div className="flex items-center gap-3"><Icon size={16} className={isError ? 'sa-metric--danger' : 'sa-metric--info'} /><span className="text-sm font-semibold text-primary">{item.titleKey ? t(item.titleKey) : item.title}</span><span className="ml-auto text-xs text-secondary">{item.actionLabelKey ? t(item.actionLabelKey) : item.actionLabel}</span></div>
                <span className="text-xs text-secondary">{t("COPY.DESTINATION_UNAVAILABLE")}</span>
              </div>
            );
          }
          return (
            <Link key={item.id} href={item.actionUrl}
              className={`sa-action-row ${isError ? 'sa-action-row--error' : 'sa-action-row--info'}`} data-testid="superadmin-dashboard-dashboard_overview-link-1">
              <div className="flex items-center gap-3">
                <Icon size={16} className={isError ? 'sa-metric--danger' : 'sa-metric--info'} />
                <span className="text-sm font-semibold text-primary">{item.titleKey ? t(item.titleKey) : item.title}</span>
              </div>
              <ChevronRight size={15} className="sa-metric--muted" />
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="sa-lightbulb-box">
            <Lightbulb size={14} className="sa-metric--primary" />
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            {t("COPY.5_NEWLY_REGISTERED_LIBRARIES_ARE_YET_TO_COMPLETE_THEIR_INITIAL_SETUP_WIZARD")}
          </p>
        </div>
        <Link href={__SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES} className="sa-panel-view-all" data-testid="superadmin-dashboard-dashboard_overview-link-2">
          <ExternalLink size={13} /> {t("COPY.VIEW_ALL_ACTIVITIES")}
        </Link>
      </div>
    </div>
  );
}
