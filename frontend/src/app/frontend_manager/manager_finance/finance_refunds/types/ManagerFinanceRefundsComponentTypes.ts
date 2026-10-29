/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceRefundsSearchParams } from '@/app/frontend_manager/manager_finance/finance_refunds/types/ManagerFinanceRefundsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceRefundsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceRefundsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceRefundsPageProps = {
  searchParams?: Promise<ManagerFinanceRefundsSearchParams>;
};
