/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceCollectFeeSearchParams } from '@/app/frontend_manager/manager_finance/finance_collect_fee/types/ManagerFinanceCollectFeeMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceCollectFeeEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceCollectFeeRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type PendingConfirmation = { message: string; cancelLabel: string; continueLabel: string; resolve: (confirmed: boolean) => void };

export type ManagerFinanceCollectFeePageProps = {
  searchParams?: Promise<ManagerFinanceCollectFeeSearchParams>;
};

export type ManagerFinanceCollectFeeContractStatus = 'idle' | 'unavailable';
