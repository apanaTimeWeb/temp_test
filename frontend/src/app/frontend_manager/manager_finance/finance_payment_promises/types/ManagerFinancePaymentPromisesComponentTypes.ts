/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinancePaymentPromisesSearchParams } from '@/app/frontend_manager/manager_finance/finance_payment_promises/types/ManagerFinancePaymentPromisesMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinancePaymentPromisesEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinancePaymentPromisesRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinancePaymentPromisesPageProps = {
  searchParams?: Promise<ManagerFinancePaymentPromisesSearchParams>;
};
