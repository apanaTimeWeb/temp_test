
import type { ManagerAccountsSeatGapReportEmptyStateProps } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerAccountsSeatGapReportEmptyState({ children, className = 'fin-empty-state', testId = 'manager_accounts_seat_gap_report-empty-state' }: ManagerAccountsSeatGapReportEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
