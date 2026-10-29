
import type { ManagerFinanceReceiptsEmptyStateProps } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsComponentTypes';
// RESPONSIBILITY: Render the empty-state presentation for the components feature. It does not own backend persistence or cross-feature business logic.


/** Accessible module-owned empty/status surface; child content preserves the existing localized message and icon. */
export function ManagerFinanceReceiptsEmptyState({ children, className = 'fin-empty-state', testId = 'manager_finance_receipts-empty-state' }: ManagerFinanceReceiptsEmptyStateProps) {
  return <div role="status" aria-live="polite" data-testid={testId} className={className}>{children}</div>;
}
