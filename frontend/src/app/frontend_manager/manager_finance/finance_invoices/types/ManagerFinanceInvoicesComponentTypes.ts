/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceInvoicesSearchParams } from '@/app/frontend_manager/manager_finance/finance_invoices/types/ManagerFinanceInvoicesMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinanceInvoicesEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export type FilterStatus = 'all' | 'paid' | 'pending' | 'overdue';

export type ManagerFinanceInvoicesRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceInvoicesPageProps = {
  searchParams?: Promise<ManagerFinanceInvoicesSearchParams>;
};
