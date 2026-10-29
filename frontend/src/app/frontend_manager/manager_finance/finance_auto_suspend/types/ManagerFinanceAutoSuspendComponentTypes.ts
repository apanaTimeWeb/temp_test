/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceAutoSuspendSearchParams } from '@/app/frontend_manager/manager_finance/finance_auto_suspend/types/ManagerFinanceAutoSuspendMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceAutoSuspendEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceAutoSuspendRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceAutoSuspendPageProps = {
  searchParams?: Promise<ManagerFinanceAutoSuspendSearchParams>;
};
