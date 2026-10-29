/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerSeatsHistorySearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_history/types/ManagerSeatsHistoryMainTypes';
import type { ComponentType, ReactNode } from 'react';

export type ManagerSeatsHistoryEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerSeatsHistoryNativeCellParams<T = unknown> {
  value?: unknown;
  data?: T;
}

export interface ManagerSeatsHistoryNativeColumn<T> {
  field?: keyof T | string;
  headerName: string;
  cellRenderer?: ComponentType<ManagerSeatsHistoryNativeCellParams<T>> | ((params: ManagerSeatsHistoryNativeCellParams<T>) => ReactNode);
  valueFormatter?: (params: ManagerSeatsHistoryNativeCellParams<T>) => string;
  [key: string]: unknown;
}

export interface ManagerSeatsHistoryNativeTableProps<T> {
  rows: T[];
  columns: ManagerSeatsHistoryNativeColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  label: string;
}

export type ManagerSeatsHistoryPageProps = {
  searchParams?: Promise<ManagerSeatsHistorySearchParams>;
};
