/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceReferralsSearchParams } from '@/app/frontend_manager/manager_finance/finance_referrals/types/ManagerFinanceReferralsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceReferralsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceReferralsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceReferralsPageProps = {
  searchParams?: Promise<ManagerFinanceReferralsSearchParams>;
};
