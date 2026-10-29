// RESPONSIBILITY: Render the dashboard overview loading state component within the components feature. It does not own backend persistence or cross-feature business logic.

import { useTranslations } from 'next-intl';
export function ManagerDashboardOverviewLoadingState() {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  return (
    <div className="mgr-page" role="status" aria-live="polite">
      <div className="mgr-page-header"><div className="mgr-skeleton mgr-skeleton-title" /><div className="mgr-skeleton mgr-skeleton-action" /></div>
      <div className="mgr-kpi-grid mgr-section-gap">{[1,2,3,4].map((item) => <div key={item} className="mgr-kpi-card"><div className="mgr-skeleton mgr-skeleton-line" /><div className="mgr-skeleton mgr-skeleton-value" /></div>)}</div>
      <span className="sr-only">{tManagerUi('loading_dashboard_data')}</span>
    </div>
  );
}
