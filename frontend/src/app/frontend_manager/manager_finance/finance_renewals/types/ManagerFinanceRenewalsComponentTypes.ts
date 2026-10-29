/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerFinanceRenewalsSearchParams } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsMainTypes';
import type { ManagerFinanceRenewalsRenewalFilter } from '@/app/frontend_manager/manager_finance/finance_renewals/types/ManagerFinanceRenewalsTypes';
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

export interface ManagerFinanceRenewalsNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; emptyMessage?: string; labels?: { previous: string; next: string }; }

export type FilterType = ManagerFinanceRenewalsRenewalFilter;

export type ManagerFinanceRenewalsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerFinanceRenewalsPageProps = {
  searchParams?: Promise<ManagerFinanceRenewalsSearchParams>;
};

export type ManagerFinanceRenewalsSortDirection = 'asc' | 'desc';
