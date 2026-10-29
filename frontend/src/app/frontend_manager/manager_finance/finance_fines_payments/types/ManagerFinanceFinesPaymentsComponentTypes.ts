/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceFinesPaymentsSearchParams } from '@/app/frontend_manager/manager_finance/finance_fines_payments/types/ManagerFinanceFinesPaymentsMainTypes';
import type { ReactNode } from 'react';

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

export interface ManagerFinanceFinesPaymentsNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; emptyMessage?: string; labels?: { previous: string; next: string }; }

// RESPONSIBILITY: Render the finance fines payments feature view and preserve route query context.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export type ManagerFinanceFinesPaymentsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceFinesPaymentsPageProps = {
  searchParams?: Promise<ManagerFinanceFinesPaymentsSearchParams>;
};

export type ManagerFinanceFinesPaymentsSortDirection = 'asc' | 'desc';
