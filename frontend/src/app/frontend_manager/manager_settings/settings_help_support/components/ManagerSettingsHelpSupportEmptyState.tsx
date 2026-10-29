
import type { ManagerSettingsHelpSupportEmptyStateProps } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the settings help support feature. It does not own backend persistence or cross-feature business logic.



/** Module-owned accessible empty state; keeps each list's original message and visual class. */
export function ManagerSettingsHelpSupportEmptyState({ children, className = '', testId = 'manager_settings_help_support-empty-state' }: ManagerSettingsHelpSupportEmptyStateProps) {
  return <div className={className} role="status" aria-live="polite" data-testid={testId}>{children}</div>;
}
