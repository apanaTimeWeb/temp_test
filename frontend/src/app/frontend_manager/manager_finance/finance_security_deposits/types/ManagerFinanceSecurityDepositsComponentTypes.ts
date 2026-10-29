/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceSecurityDepositsSearchParams } from '@/app/frontend_manager/manager_finance/finance_security_deposits/types/ManagerFinanceSecurityDepositsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceSecurityDepositsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceSecurityDepositsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceSecurityDepositsPageProps = {
  searchParams?: Promise<ManagerFinanceSecurityDepositsSearchParams>;
};
