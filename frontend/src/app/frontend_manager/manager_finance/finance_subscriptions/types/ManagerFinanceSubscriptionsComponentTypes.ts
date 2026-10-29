/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceSubscriptionsSearchParams } from '@/app/frontend_manager/manager_finance/finance_subscriptions/types/ManagerFinanceSubscriptionsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceSubscriptionsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceSubscriptionsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceSubscriptionsPageProps = {
  searchParams?: Promise<ManagerFinanceSubscriptionsSearchParams>;
};
