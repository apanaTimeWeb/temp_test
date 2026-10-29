
import type { ManagerAssetsRegisterEmptyStateProps } from '@/app/frontend_manager/manager_accounts_assets/assets_register/types/ManagerAssetsRegisterComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerAssetsRegisterEmptyState({ children, className = 'fin-empty-state', testId = 'manager_assets_register-empty-state' }: ManagerAssetsRegisterEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
