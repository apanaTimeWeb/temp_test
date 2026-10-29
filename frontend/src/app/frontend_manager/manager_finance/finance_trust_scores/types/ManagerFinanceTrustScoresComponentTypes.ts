/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceTrustScoresSearchParams } from '@/app/frontend_manager/manager_finance/finance_trust_scores/types/ManagerFinanceTrustScoresMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceTrustScoresEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerFinanceTrustScoresRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceTrustScoresPageProps = {
  searchParams?: Promise<ManagerFinanceTrustScoresSearchParams>;
};
