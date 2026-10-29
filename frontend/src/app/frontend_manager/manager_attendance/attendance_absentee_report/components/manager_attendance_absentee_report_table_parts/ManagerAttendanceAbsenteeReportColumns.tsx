// RESPONSIBILITY: Render the attendance absentee report columns component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the attendance absentee report columns component within the components feature. It does not own backend persistence or cross-feature business logic.
import { Mail, Phone, Send } from 'lucide-react';
import type { NativeColumn, NativeCellParams } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';
import { formatManagerAbsenteeReportCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/utils/ManagerAttendanceAbsenteeReportDateFormatting';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';
import type { ManagerAttendanceAbsenteeReportAbsenteeColumnLabels } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportComponentTypes';
export type { ManagerAttendanceAbsenteeReportAbsenteeColumnLabels };



export function createManagerAbsenteeReportAbsenteeColumns(
  labels: ManagerAttendanceAbsenteeReportAbsenteeColumnLabels,
  shiftLabels: Record<string, string>,
  badgeClass: (daysAbsent: number) => string,
): NativeColumn<ManagerAttendanceAbsenteeReportSampleAbsentee>[] {
  return [
    {
      field: 'name', headerName: labels.student, flex: 1, minWidth: 200,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <div className="eng-td-cell py-2">
          <div className="eng-att-avatar eng-avatar--sm mr-3" aria-hidden="true">{params.data?.initials ?? ''}</div>
          <span className="eng-td-name font-medium">{params.value}</span>
        </div>
      ),
    },
    { field: 'smartId', headerName: labels.smartId, width: 120, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-td-mono">{params.value}</span> },
    { field: 'shift', headerName: labels.shift, width: 120, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-badge eng-badge--ghost mt-2 inline-block">{shiftLabels[String(params.value)] ?? params.value}</span> },
    {
      field: 'daysAbsent', headerName: labels.daysAbsent, width: 140,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <span className={`eng-badge ${badgeClass(Number(params.value))} eng-badge--lg mt-2 inline-block`}>
          {params.value} {labels.days}
        </span>
      ),
    },
    { field: 'lastSeen', headerName: labels.lastSeen, width: 130, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-td-muted">{formatManagerAbsenteeReportCalendarDate(String(params.value ?? ''), labels.locale)}</span> },
    {
      field: 'parentPhone', headerName: labels.parentContact, width: 220,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <div className="eng-td-contact flex flex-col justify-center h-full space-y-1">
          <span className="eng-td-mono flex items-center text-xs"><Phone size={10} className="mr-1" aria-hidden="true"/> {params.value}</span>
          <span className="eng-td-muted flex items-center text-xs"><Mail size={10} className="mr-1" aria-hidden="true"/> {params.data?.parentEmail ?? ''}</span>
        </div>
      ),
    },
    {
      headerName: labels.actions, width: 140, sortable: false,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <div className="eng-row-actions h-full flex items-center">
          {params.data?.notified ? (
            <span className="eng-badge eng-badge--neutral">{labels.samplePreviouslyNotified}</span>
          ) : (
            <button type="button" disabled title={labels.parentAlertsUnavailable} className="eng-btn eng-btn--ghost eng-btn--sm cursor-not-allowed">
              <Send size={12} className="mr-1" aria-hidden="true"/> {labels.alertUnavailable}
            </button>
          )}
        </div>
      ),
    },
  ];
}
