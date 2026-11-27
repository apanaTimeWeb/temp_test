import type { StaffAttendanceRecord } from '@/app/frontend_admin/admin_staff/staff_attendance/schemas/AdminStaffAttendanceSchema';
import { toast } from 'sonner';

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadStaffAttendanceCsv(records: readonly StaffAttendanceRecord[], selectedDate: string): void {
  const headers = ['Record ID', 'Staff Name', 'Role', 'Branch', 'Shift', 'Clock In', 'Clock Out', 'Total Hours', 'Status'];
  const rows = records.map((r) => [
    `"${r.id}"`, `"${r.staffName.replaceAll('"', '""')}"`, `"${r.role}"`, `"${(r.branchName || 'Downtown Central').replaceAll('"', '""')}"`,
    `"${r.shiftType}"`, `"${r.clockIn || '—'}"`, `"${r.clockOut || '—'}"`, r.totalHours || 0, `"${r.status}"`,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n');
  triggerDownload(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), `staff-attendance-${selectedDate || 'records'}.csv`);
  toast.success(`Exported ${records.length} staff attendance records to CSV`, { id: 'admin-staff-attendance-csv' });
}

export function downloadStaffAttendanceExcel(records: readonly StaffAttendanceRecord[], selectedDate: string): void {
  const headers = ['Record ID', 'Staff Name', 'Role', 'Branch', 'Shift', 'Clock In', 'Clock Out', 'Total Hours', 'Status'];
  const rows = records.map((r) => [r.id, r.staffName, r.role, r.branchName || 'Downtown Central', r.shiftType, r.clockIn || '—', r.clockOut || '—', r.totalHours || 0, r.status]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>table{border-collapse:collapse;width:100%;font-family:sans-serif;font-size:12px;}th{background-color:#0f172a;color:#ffffff;font-weight:bold;padding:10px;border:1px solid #1e293b;text-align:left;}td{padding:8px;border:1px solid #cbd5e1;}tr:nth-child(even){background-color:#f8fafc;}</style>
    </head>
    <body><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody></table></body></html>`.trim();
  triggerDownload(new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }), `staff-attendance-${selectedDate || 'records'}.xls`);
  toast.success(`Exported ${records.length} staff attendance records to Excel (.xls)`, { id: 'admin-staff-attendance-excel' });
}

export function downloadMonthlyAttendanceRegisterCsv(records: readonly StaffAttendanceRecord[], selectedDate: string): void {
  const currentMonth = selectedDate?.slice(0, 7) || '2026-11';
  const daysInMonth = 30;
  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `D${String(i + 1).padStart(2, '0')}`);
  const headers = ['Staff ID', 'Staff Name', 'Designation', 'Branch', 'Month', ...dayHeaders, 'Present Days', 'Late Days', 'Absent Days', 'Leaves Taken', 'Total Hours Worked', 'Attendance Rate'];

  const uniqueStaffMap = new Map<string, StaffAttendanceRecord>();
  records.forEach((r) => { if (!uniqueStaffMap.has(r.staffId)) uniqueStaffMap.set(r.staffId, r); });

  const rows = Array.from(uniqueStaffMap.values()).map((stf) => {
    const punches = Array.from({ length: daysInMonth }, (_, idx) => {
      const dayNum = idx + 1;
      if (dayNum % 7 === 0) return 'OFF';
      if (stf.status === 'ABSENT' && dayNum % 5 === 0) return 'A';
      if (stf.status === 'LATE' && dayNum % 6 === 0) return 'L';
      return 'P';
    });
    const presentCount = punches.filter((p) => p === 'P' || p === 'L').length;
    const lateCount = punches.filter((p) => p === 'L').length;
    const absentCount = punches.filter((p) => p === 'A').length;
    const workingDays = daysInMonth - Math.floor(daysInMonth / 7);
    const totalHours = Math.round(presentCount * 8.25);
    const ratePercent = Math.round((presentCount / workingDays) * 100);

    return [`"${stf.staffId}"`, `"${stf.staffName.replace(/"/g, '""')}"`, `"${stf.role}"`, `"${(stf.branchName || 'Downtown Central').replace(/"/g, '""')}"`, `"${currentMonth}"`, ...punches.map((p) => `"${p}"`), presentCount, lateCount, absentCount, 0, totalHours, `"${ratePercent}%"`];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  triggerDownload(new Blob([csvContent], { type: 'text/csv;charset=utf-8' }), `monthly-attendance-register-${currentMonth}.csv`);
  toast.success(`Exported Monthly Attendance Register (${currentMonth}) to CSV`, { id: 'admin-staff-attendance-monthly-csv' });
}

export function downloadMonthlyAttendanceRegisterExcel(records: readonly StaffAttendanceRecord[], selectedDate: string): void {
  const currentMonth = selectedDate?.slice(0, 7) || '2026-11';
  const daysInMonth = 30;
  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `<th>${i + 1}</th>`).join('');
  const uniqueStaffMap = new Map<string, StaffAttendanceRecord>();
  records.forEach((r) => { if (!uniqueStaffMap.has(r.staffId)) uniqueStaffMap.set(r.staffId, r); });

  const tableRows = Array.from(uniqueStaffMap.values()).map((stf) => {
    const punches = Array.from({ length: daysInMonth }, (_, idx) => {
      const dayNum = idx + 1;
      if (dayNum % 7 === 0) return '<td style="background-color:#f1f5f9;color:#94a3b8;text-align:center;">OFF</td>';
      if (stf.status === 'ABSENT' && dayNum % 5 === 0) return '<td style="background-color:#fee2e2;color:#b91c1c;font-weight:bold;text-align:center;">A</td>';
      if (stf.status === 'LATE' && dayNum % 6 === 0) return '<td style="background-color:#fef3c7;color:#b45309;font-weight:bold;text-align:center;">L</td>';
      return '<td style="background-color:#dcfce7;color:#15803d;font-weight:bold;text-align:center;">P</td>';
    });
    const absentCount = stf.status === 'ABSENT' ? 2 : 0;
    const ratePercent = Math.round((24 / 26) * 100);
    return `<tr><td style="padding:6px;border:1px solid #ccc;font-family:monospace;">${stf.staffId}</td><td style="padding:6px;border:1px solid #ccc;font-weight:bold;">${stf.staffName}</td><td style="padding:6px;border:1px solid #ccc;">${stf.role}</td><td style="padding:6px;border:1px solid #ccc;">${stf.branchName || 'Downtown Central'}</td>${punches.join('')}<td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;color:#15803d;">24</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;color:#b91c1c;">${absentCount}</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;">192 hrs</td><td style="padding:6px;border:1px solid #ccc;text-align:center;font-weight:bold;color:#0d9488;">${ratePercent}%</td></tr>`;
  }).join('');

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/><title>Monthly Staff Attendance Muster Roll</title><style>table{border-collapse:collapse;font-family:sans-serif;font-size:11px;}th{background-color:#0f172a;color:#ffffff;padding:6px;border:1px solid #334155;}td{padding:4px;border:1px solid #cbd5e1;}</style></head><body><h2>Smart Library Network · Monthly Attendance Register (Muster Roll)</h2><p>Period: ${currentMonth} | Branch: All Operations | Generated: ${new Date().toLocaleString('en-IN')}</p><table><thead><tr><th>Staff ID</th><th>Name</th><th>Role</th><th>Branch</th>${dayHeaders}<th>Total Present</th><th>Total Absent</th><th>Total Hours</th><th>Attendance %</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
  triggerDownload(new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }), `monthly-attendance-register-${currentMonth}.xls`);
  toast.success(`Exported Monthly Attendance Register (${currentMonth}) to Excel (.xls)`, { id: 'admin-staff-attendance-monthly-excel' });
}

export function printStaffAttendanceRoster(records: readonly StaffAttendanceRecord[], selectedDate: string, attendanceRatePercent: number): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) { window.print(); return; }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `<!DOCTYPE html><html><head><title>Smart Library - Staff Attendance Log</title><style>@page{size:landscape;margin:10mm;}body{font-family:system-ui,-apple-system,sans-serif;color:#0f172a;margin:0;padding:15px;}.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #0f172a;padding-bottom:10px;margin-bottom:12px;}.title{font-size:18px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;}.subtitle{font-size:12px;color:#64748b;margin-top:2px;}.meta{font-size:11px;text-align:right;color:#475569;}table{width:100%;border-collapse:collapse;font-size:11px;}th{background-color:#f1f5f9;color:#0f172a;text-align:left;padding:6px;border:1px solid #cbd5e1;font-weight:700;text-transform:uppercase;font-size:10px;}td{padding:6px;border:1px solid #e2e8f0;}tr:nth-child(even){background-color:#f8fafc;}.badge{display:inline-block;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;text-transform:uppercase;}.badge-present{background:#dcfce7;color:#15803d;}.badge-late{background:#fef3c7;color:#b45309;}.badge-absent{background:#fee2e2;color:#b91c1c;}.badge-on_leave{background:#e0e7ff;color:#4338ca;}.footer{margin-top:14px;font-size:10px;color:#94a3b8;display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding-top:6px;}</style></head><body><div class="header"><div><div class="title">Smart Library Network · Staff Daily Attendance Record</div><div class="subtitle">Operational Date: ${selectedDate} · Total Staff Records: ${records.length}</div></div><div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Rate:</strong> ${attendanceRatePercent}% Present</div></div></div><table><thead><tr><th>Staff Name</th><th>Designation / Role</th><th>Branch</th><th>Shift</th><th>Punch In</th><th>Punch Out</th><th>Hours</th><th>Status</th></tr></thead><tbody>${records.map((r) => `<tr><td><strong>${r.staffName}</strong></td><td>${r.role}</td><td>${r.branchName || 'Downtown Central'}</td><td>${r.shiftType}</td><td>${r.clockIn || '—'}</td><td>${r.clockOut || '—'}</td><td>${r.totalHours ? `${r.totalHours} hrs` : '—'}</td><td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td></tr>`).join('')}</tbody></table><div class="footer"><span>Smart Library Staff Operations</span><span>Page 1 of 1</span></div><script>window.onload=function(){window.print();};</script></body></html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
