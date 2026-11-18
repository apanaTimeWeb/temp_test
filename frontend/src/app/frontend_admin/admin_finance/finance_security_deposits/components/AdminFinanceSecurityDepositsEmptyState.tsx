import type { ReactNode } from 'react';

export interface AdminFinanceSecurityDepositsEmptyStateProps {
  children?: ReactNode;
  className?: string;
  testId?: string;
}

export function AdminFinanceSecurityDepositsEmptyState({
  children,
  className = 'flex flex-col items-center justify-center p-8 text-center text-secondary',
  testId = 'admin_finance_security_deposits-empty-state',
}: AdminFinanceSecurityDepositsEmptyStateProps) {
  return (
    <div className={className} data-testid={testId}>
      {children || <p>No security deposits found.</p>}
    </div>
  );
}
