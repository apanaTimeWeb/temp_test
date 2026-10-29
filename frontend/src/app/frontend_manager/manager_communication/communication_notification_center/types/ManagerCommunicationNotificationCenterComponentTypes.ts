/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerCommunicationNotificationCenterSearchParams } from '@/app/frontend_manager/manager_communication/communication_notification_center/types/ManagerCommunicationNotificationCenterMainTypes';
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

export interface ManagerCommunicationNotificationCenterNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string }; }

export type ManagerCommunicationNotificationCenterPageProps = {
  searchParams?: Promise<ManagerCommunicationNotificationCenterSearchParams>;
};

export type ManagerCommunicationNotificationCenterSortDirection = 'asc' | 'desc';
