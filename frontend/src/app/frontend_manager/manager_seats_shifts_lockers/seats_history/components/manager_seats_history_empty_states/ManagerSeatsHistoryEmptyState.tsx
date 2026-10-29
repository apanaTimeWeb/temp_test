
import type { ManagerSeatsHistoryEmptyStateProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerSeatsHistoryEmptyState({ children, className = 'fin-empty-state', testId = 'manager_seats_history-empty-state' }: ManagerSeatsHistoryEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
