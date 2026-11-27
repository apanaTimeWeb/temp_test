import type { ManagerAttendanceAbsenteeReportSampleAbsentee } from '@/app/frontend_manager/manager_attendance/attendance_absentee_report/hooks/ManagerAttendanceAbsenteeReportDemoRepository';

function escapeCsvCell(v: unknown): string {
  const s = String(v ?? '');
  return /^[\u0000-\u0020]*[=+\-@]/.test(s) ? `'"${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`;
}

export function exportManagerAbsenteeReportCsv(filtered: ManagerAttendanceAbsenteeReportSampleAbsentee[]): void {
  const headers = [
    'Student Name', 'Smart ID', 'Shift', 'Days Absent', 'Last Seen',
    'Parent Phone', 'Parent Email', 'Alert Status', 'Excused Status', 'Leave Reason',
  ].map(escapeCsvCell).join(',');

  const rows = filtered
    .map((item) => [
      item.name, item.smartId, item.shift, item.daysAbsent, item.lastSeen,
      item.parentPhone, item.parentEmail,
      item.notified ? 'Notified' : 'Pending Alert',
      item.excused ? 'Excused Leave' : 'Unexcused',
      item.leaveReason || '',
    ].map(escapeCsvCell).join(','))
    .join('\r\n');

  const blob = new Blob([`\uFEFF${headers}\r\n${rows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `absentee_report_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
