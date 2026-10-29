
import type { ManagerDashboardOverviewEmptyStateProps } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the dashboard overview feature. It does not own backend persistence or cross-feature business logic.



/** Module-owned accessible empty state; keeps each list's original message and visual class. */
export function ManagerDashboardOverviewEmptyState({ children, className = '', testId = 'manager_dashboard_overview-empty-state' }: ManagerDashboardOverviewEmptyStateProps) {
  return <div className={className} role="status" aria-live="polite" data-testid={testId}>{children}</div>;
}
