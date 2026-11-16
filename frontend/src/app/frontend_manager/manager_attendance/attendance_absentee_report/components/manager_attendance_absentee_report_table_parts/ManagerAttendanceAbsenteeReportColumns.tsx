// RESPONSIBILITY: Render the attendance absentee report columns component within the components feature. It does not own backend persistence or cross-feature business logic.
// RESPONSIBILITY: Render the attendance absentee report columns component within the components feature. It does not own backend persistence or cross-feature business logic.
import { Mail, Phone, MessageSquare, Eye } from 'lucide-react';
import type { NativeColumn, NativeCellParams } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/components/manager_attendance_absentee_report_table_parts/ManagerAttendanceAbsenteeReportNativeTable';
import { formatManagerAbsenteeReportCalendarDate } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/utils/ManagerAttendanceAbsenteeReportDateFormatting';
import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';
import type { ManagerAttendanceAbsenteeReportAbsenteeColumnLabels } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/types/ManagerAttendanceAbsenteeReportComponentTypes';
export type { ManagerAttendanceAbsenteeReportAbsenteeColumnLabels };

export function createManagerAbsenteeReportAbsenteeColumns(
  labels: ManagerAttendanceAbsenteeReportAbsenteeColumnLabels,
  shiftLabels: Record<string, string>,
  badgeClass: (daysAbsent: number) => string,
  onAlertWhatsApp?: (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => void,
  onViewDetails?: (item: ManagerAttendanceAbsenteeReportSampleAbsentee) => void,
): NativeColumn<ManagerAttendanceAbsenteeReportSampleAbsentee>[] {
  return [
    {
      field: 'name', headerName: labels.student, flex: 1, minWidth: 200,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <div className="eng-td-cell py-2 flex items-center">
          <div className="eng-att-avatar eng-avatar--sm mr-3 shrink-0" aria-hidden="true">{params.data?.initials ?? ''}</div>
          <span className="eng-td-name font-medium">{params.value}</span>
        </div>
      ),
    },
    { field: 'smartId', headerName: labels.smartId, width: 120, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-td-mono">{params.value}</span> },
    { field: 'shift', headerName: labels.shift, width: 120, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-badge eng-badge--ghost mt-2 inline-block">{shiftLabels[String(params.value)] ?? params.value}</span> },
    {
      field: 'daysAbsent', headerName: labels.daysAbsent, width: 150,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => {
        if (params.data?.excused) {
          return (
            <div className="flex flex-col gap-0.5 mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 w-fit">
                Excused Leave
              </span>
              <span className="text-[10px] text-secondary truncate max-w-[130px]" title={params.data.leaveReason}>
                {params.data.leaveReason || 'Approved'} ({params.value} {labels.days})
              </span>
            </div>
          );
        }
        return (
          <span className={`eng-badge ${badgeClass(Number(params.value))} eng-badge--lg mt-2 inline-block`}>
            {params.value} {labels.days}
          </span>
        );
      },
    },
    { field: 'lastSeen', headerName: labels.lastSeen, width: 130, cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => <span className="eng-td-muted">{formatManagerAbsenteeReportCalendarDate(String(params.value ?? ''), labels.locale)}</span> },
    {
      field: 'parentPhone', headerName: labels.parentContact, width: 220,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => (
        <div className="eng-td-contact flex flex-col justify-center h-full space-y-1">
          <span className="eng-td-mono flex items-center text-xs"><Phone size={10} className="mr-1 text-emerald-400" aria-hidden="true"/> {params.value}</span>
          <span className="eng-td-muted flex items-center text-xs"><Mail size={10} className="mr-1 text-sky-400" aria-hidden="true"/> {params.data?.parentEmail ?? ''}</span>
        </div>
      ),
    },
    {
      headerName: labels.actions, width: 180, sortable: false,
      cellRenderer: (params: NativeCellParams<ManagerAttendanceAbsenteeReportSampleAbsentee>) => {
        const item = params.data;
        if (!item) return null;
        const cleanPhone = (item.parentPhone || '').replace(/\D/g, '');

        return (
          <div className="eng-row-actions h-full flex items-center gap-1.5 justify-end">
            {onViewDetails && (
              <button
                type="button"
                onClick={() => onViewDetails(item)}
                className="p-1.5 rounded-lg text-sky-400 hover:text-sky-300 hover:bg-sky-500/15 transition-colors cursor-pointer"
                title={`View absentee profile for ${item.name}`}
                aria-label={`View absentee profile for ${item.name}`}
              >
                <Eye size={15} />
              </button>
            )}

            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 transition-colors cursor-pointer"
                title={`Call parent (+91 ${cleanPhone})`}
                aria-label={`Call parent (+91 ${cleanPhone})`}
              >
                <Phone size={14} />
              </a>
            )}

            {item.notified ? (
              <span className="eng-badge eng-badge--neutral text-[10px]">{labels.samplePreviouslyNotified}</span>
            ) : (
              <button
                type="button"
                onClick={() => onAlertWhatsApp?.(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                title={`Send WhatsApp alert to ${item.name}'s parent`}
              >
                <MessageSquare size={12} className="mr-0.5" /> WhatsApp
              </button>
            )}
          </div>
        );
      },
    },
  ];
}
