/** Module-local component props and UI/state types extracted from component files. */
import type { WaLog } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/hooks/ManagerCommunicationWhatsappLogsDemoRepository';
import type { ManagerCommunicationWhatsappLogsSearchParams } from '@/app/frontend_manager/manager_communication/communication_whatsapp_logs/types/ManagerCommunicationWhatsappLogsMainTypes';
import type { ReactNode } from 'react';

export interface ManagerCommunicationWhatsappLogsWhatsappLogDetailsDialogProps {
  log: WaLog | null;
  typeLabel: string;
  statusLabel: string;
  typeClassName: string;
  statusClassName: string;
  onClose: () => void;
  labels: { close: string; messageDetails: string; to: string; student: string; sentAt: string; messageContent: string; error: string };
}

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

export interface ManagerCommunicationWhatsappLogsNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string }; }

// RESPONSIBILITY: Render the ManagerCommunicationWhatsappLogs feature view and preserve route query context.
// DATA FLOW: Next.js searchParams -> route page -> Main props -> feature view.
export type ManagerCommunicationWhatsappLogsRouteQueryProps = {
  view?: string;
  id?: string;
  name?: string;
  phone?: string;
  smartId?: string;
};

export type ManagerCommunicationWhatsappLogsPageProps = {
  searchParams?: Promise<ManagerCommunicationWhatsappLogsSearchParams>;
};

export type ManagerCommunicationWhatsappLogsSortDirection = 'asc' | 'desc';
