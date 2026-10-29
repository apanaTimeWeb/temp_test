
import type { ManagerSeatsAllocationsEmptyStateProps } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerSeatsAllocationsEmptyState({ children, className = 'fin-empty-state', testId = 'manager_seats_allocations-empty-state' }: ManagerSeatsAllocationsEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
