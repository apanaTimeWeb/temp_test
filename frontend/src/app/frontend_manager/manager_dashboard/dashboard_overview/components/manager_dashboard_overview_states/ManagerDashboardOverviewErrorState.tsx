'use client';
// RESPONSIBILITY: Render the dashboard overview error state component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the dashboard overview error state component within the components feature. It does not own backend persistence or cross-feature business logic.
import { useTranslations } from 'next-intl';
import type { ManagerDashboardOverviewErrorStateProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewErrorStateProps };


export function ManagerDashboardOverviewErrorState({ message, onRetry }: ManagerDashboardOverviewErrorStateProps) {
  const tManagerUi = useTranslations('manager.manager_dashboard.ui');
  return (
    <div className="mgr-card mgr-state-card" role="alert">
      <h2 className="mgr-section-title">{tManagerUi('dashboard_unavailable')}</h2>
      <p className="mgr-text-secondary">{message}</p>
      {onRetry ? <button type="button" className="mgr-btn-primary mgr-btn-sm" onClick={onRetry}>{tManagerUi('retry')}</button> : null}
    </div>
  );
}
