/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceReceiptsSearchParams } from '@/app/frontend_manager/manager_finance/finance_receipts/types/ManagerFinanceReceiptsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceReceiptsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type FilterMode = 'all' | 'upi' | 'cash' | 'card' | 'bank transfer';

export type ManagerFinanceReceiptsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceReceiptsPageProps = {
  searchParams?: Promise<ManagerFinanceReceiptsSearchParams>;
};
