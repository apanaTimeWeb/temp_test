/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerSeatsManagementSearchParams } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementMainTypes';
import type { SeatData } from '@/app/frontend_manager/manager_seats_shifts_lockers/seats_management/types/ManagerSeatsManagementTypes';
import type { ComponentType, ReactNode } from 'react';

export type ManagerSeatsManagementEmptyStateProps = { children: ReactNode; className?: string; testId?: string };

export interface ManagerSeatsManagementNativeCellParams<T = unknown> {
  value?: unknown;
  data?: T;
}

export interface ManagerSeatsManagementNativeColumn<T> {
  field?: keyof T | string;
  headerName: string;
  cellRenderer?: ComponentType<ManagerSeatsManagementNativeCellParams<T>> | ((params: ManagerSeatsManagementNativeCellParams<T>) => ReactNode);
  valueFormatter?: (params: ManagerSeatsManagementNativeCellParams<T>) => string;
  [key: string]: unknown;
}

export interface ManagerSeatsManagementNativeTableProps<T> {
  rows: T[];
  columns: ManagerSeatsManagementNativeColumn<T>[];
  getRowKey: (row: T, index: number) => string;
  label: string;
}

export type Props = { seat?: string };

export type ManagerSeatsManagementSeatManagementClientSeatStatus = 'Working' | 'Maintenance' | 'Broken';

export type SeatManagementRow = { uuid?: string; seatNo: string; branch: string; status: SeatData['status']; assignedTo: string; lastMaintenance: string; smartId?: string; shift?: string; expiry?: string; student?: string };

export type SeatDraft = { seatNo: string; branch: string; status: ManagerSeatsManagementSeatManagementClientSeatStatus };

export type SeatStatusTranslationKey = 'free' | 'occupied' | 'expiring_soon' | 'maintenance' | 'unknown_status';

export type ManagerSeatsManagementPageProps = {
  searchParams?: Promise<ManagerSeatsManagementSearchParams>;
};
