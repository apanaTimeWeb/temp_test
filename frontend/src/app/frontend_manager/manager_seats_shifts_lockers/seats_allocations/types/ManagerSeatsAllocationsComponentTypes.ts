/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerSeatsAllocationsSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_allocations/types/ManagerSeatsAllocationsMainTypes';
import type { ComponentType, ReactNode } from 'react';

export type ManagerSeatsAllocationsEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerSeatsAllocationsNativeCellParams<T = unknown> {
  value?: unknown;
  data?: T;
}

export interface ManagerSeatsAllocationsNativeColumn<T> {
  field?: keyof T | string;
  headerName: string;
  cellRenderer?: ComponentType<ManagerSeatsAllocationsNativeCellParams<T>> | ((params: ManagerSeatsAllocationsNativeCellParams<T>) => ReactNode);
  valueFormatter?: (params: ManagerSeatsAllocationsNativeCellParams<T>) => string;
  [key: string]: unknown;
}

export interface ManagerSeatsAllocationsNativeTableProps<T> {
  rows: T[];
  columns: ManagerSeatsAllocationsNativeColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  label: string;
}

export type ManagerSeatsAllocationsPageProps = {
  searchParams?: Promise<ManagerSeatsAllocationsSearchParams>;
};
