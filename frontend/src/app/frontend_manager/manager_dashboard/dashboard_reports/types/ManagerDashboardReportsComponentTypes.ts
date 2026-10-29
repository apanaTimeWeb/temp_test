/** Module-local component props and UI/state types extracted from component files. */
import type { ReactNode } from 'react';

export type ManagerDashboardReportsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerDashboardReportsChartDataRow { label: string; value: string; }

export interface ManagerDashboardReportsChartDataTableProps { caption: string; rows: ManagerDashboardReportsChartDataRow[]; }

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

export interface ManagerDashboardReportsNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string; range?: (start: number, end: number, total: number) => string }; label: string; }

export interface ManagerDashboardReportsTableCardProps<T extends object>{title:string;rows:T[];columns:NativeColumn<T>[];height:228|260|280;emptyMessage:string;getRowKey:(row: T) => string}

export type ManagerDashboardReportsSortDirection = 'asc' | 'desc';

export type ManagerDashboardReportsTrendTone = 'up' | 'down' | 'neutral';
