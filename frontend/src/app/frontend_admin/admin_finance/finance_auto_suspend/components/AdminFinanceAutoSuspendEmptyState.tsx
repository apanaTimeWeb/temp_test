import type { ReactNode } from 'react';

export interface AdminFinanceAutoSuspendEmptyStateProps {
  children?: ReactNode;
  className?: string;
  testId?: string;
}

export function AdminFinanceAutoSuspendEmptyState({
  children,
  className = 'flex flex-col items-center justify-center p-8 text-center text-secondary',
  testId = 'admin_finance_auto_suspend-empty-state',
}: AdminFinanceAutoSuspendEmptyStateProps) {
  return (
    <div className={className} data-testid={testId}>
      {children || <p>No records found.</p>}
    </div>
  );
}
