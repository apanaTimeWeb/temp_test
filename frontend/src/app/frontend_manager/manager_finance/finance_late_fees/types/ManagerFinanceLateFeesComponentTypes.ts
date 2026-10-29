/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceLateFeesSearchParams } from '@/app/frontend_manager/manager_finance/finance_late_fees/types/ManagerFinanceLateFeesMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceLateFeesEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceLateFeesRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceLateFeesPageProps = {
  searchParams?: Promise<ManagerFinanceLateFeesSearchParams>;
};
