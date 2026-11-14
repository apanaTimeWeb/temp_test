/** Responsibility: Superadmin Dashboard Recent Activity Feed; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminDashboardOverviewRecentActivityFeed formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";
import type { SuperadminDashboardRecentActivityFeedProps } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { useTranslations } from 'next-intl';


/**
 * Performs the superadmin dashboard overview recent activity feed operation within dashboard overview; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: SuperadminDashboardRecentActivityFeedProps.
 */
export default function SuperadminDashboardOverviewRecentActivityFeed({ items }: SuperadminDashboardRecentActivityFeedProps) {
  const t = useTranslations('SUPERADMIN_DASHBOARD');
  return (
    <section className="sa-card overflow-hidden mt-8" aria-labelledby="superadmin-recent-activity-title">
      <div className="p-6 flex items-center justify-between border-b border-border">
        <h2 id="superadmin-recent-activity-title" className="text-base font-bold text-primary flex items-center gap-2">
          <Clock size={16} className="sa-metric--primary" aria-hidden="true" /> {t("COPY.RECENT_PLATFORM_ACTIVITY")}
        </h2>
        <Link href={__SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.AUDIT_LOGS} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline" data-testid="superadmin-dashboard-dashboard_overview-link-1">
          {t("COPY.VIEW_ALL_LOGS")}
        </Link>
      </div>
      <p className="mb-2 text-xs text-secondary" role="note">{t("COPY.SAMPLE_ACTIVITY_FEED_ONLY_NO_LIVE_PLATFORM_EVENTS_ARE_CONNECTED_IN_THIS_SOURCE_ARCHIVE")}</p>
      <div>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className="sa-recent-activity-row block" data-testid="superadmin-dashboard-dashboard_overview-link-2">
            <div className="flex items-center gap-4">
              <div className={`sa-recent-activity-dot ${item.dotCls}`} aria-hidden="true" />
              <div className="flex-1 min-w-0">
                <p className="sa-recent-activity-title">{item.titleKey ? t(item.titleKey) : item.title}</p>
                <p className="sa-recent-activity-desc">{item.descriptionKey ? t(item.descriptionKey) : item.description}</p>
              </div>
              <span className="sa-recent-activity-time">{item.timeLabelKey ? t(item.timeLabelKey) : item.timeLabel}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
