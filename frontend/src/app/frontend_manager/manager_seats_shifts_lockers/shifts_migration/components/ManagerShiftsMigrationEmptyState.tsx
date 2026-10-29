
import type { ManagerShiftsMigrationEmptyStateProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_migration/types/ManagerShiftsMigrationComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the shifts migration feature. It does not own backend persistence or cross-feature business logic.



/** Module-owned accessible empty state; keeps each list's original message and visual class. */
export function ManagerShiftsMigrationEmptyState({ children, className = '', testId = 'manager_shifts_migration-empty-state' }: ManagerShiftsMigrationEmptyStateProps) {
  return <div className={className} role="status" aria-live="polite" data-testid={testId}>{children}</div>;
}
