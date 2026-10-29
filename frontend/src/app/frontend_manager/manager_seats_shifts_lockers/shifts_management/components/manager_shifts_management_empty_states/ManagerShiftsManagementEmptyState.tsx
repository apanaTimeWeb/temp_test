
import type { ManagerShiftsManagementEmptyStateProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/shifts_management/types/ManagerShiftsManagementComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerShiftsManagementEmptyState({ children, className = 'fin-empty-state', testId = 'manager_shifts_management-empty-state' }: ManagerShiftsManagementEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
