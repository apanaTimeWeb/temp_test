
import type { ManagerMembersIdCardGeneratorEmptyStateProps } from '@/app/frontend_manager/manager_members/members_id_card_generator/types/ManagerMembersIdCardGeneratorComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerMembersIdCardGeneratorEmptyState({ children, className = 'fin-empty-state', testId = 'manager_members_id_card_generator-empty-state' }: ManagerMembersIdCardGeneratorEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
