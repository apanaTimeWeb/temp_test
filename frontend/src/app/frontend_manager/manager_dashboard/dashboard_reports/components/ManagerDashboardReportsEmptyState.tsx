
import type { ManagerDashboardReportsEmptyStateProps } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the dashboard reports feature. It does not own backend persistence or cross-feature business logic.



/** Module-owned accessible empty state; keeps each list's original message and visual class. */
export function ManagerDashboardReportsEmptyState({ children, className = '', testId = 'manager_dashboard_reports-empty-state' }: ManagerDashboardReportsEmptyStateProps) {
  return <div className={className} role="status" aria-live="polite" data-testid={testId}>{children}</div>;
}
