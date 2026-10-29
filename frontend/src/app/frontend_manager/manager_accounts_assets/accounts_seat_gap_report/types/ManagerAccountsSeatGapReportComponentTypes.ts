/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAccountsSeatGapReportSearchParams } from '@/app/frontend_manager/manager_accounts_assets/accounts_seat_gap_report/types/ManagerAccountsSeatGapReportMainTypes';
import type { ReactNode } from 'react';

export type ManagerAccountsSeatGapReportEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type ManagerAccountsSeatGapReportPageProps = {
  searchParams?: Promise<ManagerAccountsSeatGapReportSearchParams>;
};

export type ManagerAccountsSeatGapReportCategoryTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
