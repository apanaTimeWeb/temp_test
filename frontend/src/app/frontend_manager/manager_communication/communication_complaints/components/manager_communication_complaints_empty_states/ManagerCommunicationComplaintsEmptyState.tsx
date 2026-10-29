
import type { ManagerCommunicationComplaintsEmptyStateProps } from '@/app/frontend_manager/manager_communication/communication_complaints/types/ManagerCommunicationComplaintsComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerCommunicationComplaintsEmptyState({ children, className = 'fin-empty-state', testId = 'manager_communication_complaints-empty-state' }: ManagerCommunicationComplaintsEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
