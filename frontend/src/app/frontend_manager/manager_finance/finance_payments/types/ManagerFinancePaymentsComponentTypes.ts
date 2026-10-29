/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinancePaymentsSearchParams } from '@/app/frontend_manager/manager_finance/finance_payments/types/ManagerFinancePaymentsMainTypes';
import type { ReactNode } from 'react';

export type ManagerFinancePaymentsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface NativeCellParams<T = object> { data?: T; value?: string | number | boolean | null; }

export interface NativeColumn<T = object> {
  field?: string;
  headerName?: string;
  sortable?: boolean;
  cellClass?: string | ((params: NativeCellParams<T>) => string);
  cellRenderer?: (params: NativeCellParams<T>) => ReactNode;
  valueFormatter?: (params: NativeCellParams<T>) => ReactNode;
  [key: string]: unknown;
}

export interface ManagerFinancePaymentsNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; emptyMessage?: string; labels?: { previous: string; next: string }; }

export type ManagerFinancePaymentsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinancePaymentsPageProps = {
  searchParams?: Promise<ManagerFinancePaymentsSearchParams>;
};

export type ManagerFinancePaymentsSortDirection = 'asc' | 'desc';
