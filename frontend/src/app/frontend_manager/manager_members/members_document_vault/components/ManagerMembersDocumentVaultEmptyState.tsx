
import type { ManagerMembersDocumentVaultEmptyStateProps } from '@/app/frontend_manager/manager_members/members_document_vault/types/ManagerMembersDocumentVaultComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the members document vault feature. It does not own backend persistence or cross-feature business logic.



/** Module-owned accessible empty state; keeps each list's original message and visual class. */
export function ManagerMembersDocumentVaultEmptyState({ children, className = '', testId = 'manager_members_document_vault-empty-state' }: ManagerMembersDocumentVaultEmptyStateProps) {
  return <div className={className} role="status" aria-live="polite" data-testid={testId}>{children}</div>;
}
