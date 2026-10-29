/** Module-local component props and UI/state types extracted from component files. */
import type { ManagerAttendanceAbsenteeReportSearchParams } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportMainTypes';
import type { ReactNode } from 'react';

export interface ManagerAttendanceAbsenteeReportAbsenteeColumnLabels {
  student: string;
  smartId: string;
  shift: string;
  daysAbsent: string;
  days: string;
  lastSeen: string;
  parentContact: string;
  actions: string;
  samplePreviouslyNotified: string;
  parentAlertsUnavailable: string;
  alertUnavailable: string;
  locale: string;
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

export interface ManagerAttendanceAbsenteeReportNativeTableProps<T extends object> { rows: T[]; columns: NativeColumn<T>[]; getRowKey: (row: T) => string; labels?: { previous: string; next: string }; }

export type ManagerAttendanceAbsenteeReportPageProps = {
  searchParams?: Promise<ManagerAttendanceAbsenteeReportSearchParams>;
};

export type ManagerAttendanceAbsenteeReportSortDirection = 'asc' | 'desc';
