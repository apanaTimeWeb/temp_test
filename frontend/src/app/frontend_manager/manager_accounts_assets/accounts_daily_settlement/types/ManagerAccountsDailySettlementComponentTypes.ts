/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAccountsDailySettlementSearchParams } from '@/app/frontend_manager/manager_accounts_assets/accounts_daily_settlement/types/ManagerAccountsDailySettlementMainTypes';
import type { CSSProperties, ReactNode } from 'react';

export interface NativeCellParams<T = object> { data?: T; value?: string | number | boolean | null; }

export interface NativeColumn<T = object> {
  field?: string;
  headerName?: string;
  sortable?: boolean;
  cellStyle?: CSSProperties;
  cellClass?: string | ((params: NativeCellParams<T>) => string);
  cellRenderer?: (params: NativeCellParams<T>) => ReactNode;
  valueFormatter?: (params: NativeCellParams<T>) => ReactNode;
  [key: string]: unknown;
}

export interface ManagerAccountsDailySettlementNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string }; }

export type ManagerAccountsDailySettlementPageProps = {
  searchParams?: Promise<ManagerAccountsDailySettlementSearchParams>;
};

export type ManagerAccountsDailySettlementSortDirection = 'asc' | 'desc';

export type ManagerAccountsDailySettlementCategoryTone = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
