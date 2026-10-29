/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerLockersManagementSampleLocker as Locker } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/mocks/manager_lockers_management_fixtures/ManagerLockersManagementSampleFixtures';
import type { ManagerLockersManagementSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/lockers_management/types/ManagerLockersManagementMainTypes';
import type { ComponentType, ReactNode } from 'react';

export interface ManagerLockersManagementNativeCellParams<T = unknown> {
  value?: unknown;
  data?: T;
}

export interface ManagerLockersManagementNativeColumn<T> {
  field?: keyof T | string;
  headerName: string;
  cellRenderer?: ComponentType<ManagerLockersManagementNativeCellParams<T>> | ((params: ManagerLockersManagementNativeCellParams<T>) => ReactNode);
  valueFormatter?: (params: ManagerLockersManagementNativeCellParams<T>) => string;
  [key: string]: unknown;
}

export interface ManagerLockersManagementNativeTableProps<T> {
  rows: T[];
  columns: ManagerLockersManagementNativeColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  label: string;
}

export type LockerStatus = Locker['status'];

export type ManagerLockersManagementPageProps = {
  searchParams?: Promise<ManagerLockersManagementSearchParams>;
};
