// RESPONSIBILITY: Render the dashboard overview action items component within the components feature. It does not own backend persistence or cross-feature business logic.

// RESPONSIBILITY: Render the dashboard overview action items component within the components feature. It does not own backend persistence or cross-feature business logic.
import { ManagerDashboardOverviewEmptyState } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/ManagerDashboardOverviewEmptyState';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { ManagerDashboardOverviewActionItemsProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewActionItemsProps };




export function ManagerDashboardOverviewActionItems({ items }: ManagerDashboardOverviewActionItemsProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  const localizeKnownTitle = (title: string) => {
    switch (title) {
      case 'Fees due today': return tManagerUi('dashboard_action_fees_due_today');
      case 'Renewals due': return tManagerUi('dashboard_action_renewals_due');
      case 'New enquiries': return tManagerUi('dashboard_action_new_enquiries');
      default: return title;
    }
  };
  return (
    <section className="mgr-card" aria-labelledby="manager-dashboard-action-items-heading">
      <div className="mgr-card-header"><h2 id="manager-dashboard-action-items-heading" className="mgr-section-title">{tManagerUi('my_action_items')}</h2></div>
      <div className="mgr-card-body">
        {items.length === 0 ? <ManagerDashboardOverviewEmptyState className="p-6 text-sm text-secondary" testId="manager-dashboard-action-items-empty">{tManagerUi('no_action_items_available')}</ManagerDashboardOverviewEmptyState> : items.map((item) => (
          <div key={item.title} className="mgr-action-item">
            <span className="mgr-action-label">{localizeKnownTitle(item.title)}</span>
            <div className="mgr-action-right">
              <span className={item.countClass}>{item.count}</span>
              <Link href={item.href} className={item.showRenew ? 'mgr-btn-primary mgr-btn-sm' : 'mgr-action-link'}>{item.showRenew ? tManagerUi('renew') : tManagerUi('view')}</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
