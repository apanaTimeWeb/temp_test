// RESPONSIBILITY: Render the dashboard overview quick links component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the dashboard overview quick links component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { ManagerDashboardOverviewQuickLink, ManagerDashboardOverviewQuickLinkTitleKey, ManagerDashboardOverviewQuickLinksProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewQuickLinkTitleKey, ManagerDashboardOverviewQuickLink, ManagerDashboardOverviewQuickLinksProps };





export function ManagerDashboardOverviewQuickLinks({ links }: ManagerDashboardOverviewQuickLinksProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  return (
    <section className="mgr-card" aria-labelledby="manager-dashboard-quick-links-heading">
      <div className="mgr-card-header"><h2 id="manager-dashboard-quick-links-heading" className="mgr-section-title">{tManagerUi('quick_links')}</h2></div>
      <div className="mgr-card-body">
        <div className="mgr-quick-links-grid">
          {links.map((link) => (
            <Link key={link.titleKey} href={link.href} className="mgr-action-link"><ChevronRight size={14} />{tManagerUi(link.titleKey)}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
