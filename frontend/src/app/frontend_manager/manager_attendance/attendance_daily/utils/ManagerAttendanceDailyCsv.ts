import type { Student } from '@/app/frontend_manager/manager_attendance/attendance_daily/types/ManagerAttendanceDailyComponentTypes';

export function formatManagerAttendanceDailyCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

function escapeCsvCell(val: unknown): string {
  let str = String(val ?? '');
  if (/^[\u0000-\u0020]*[=+\-@]/.test(str)) str = `'${str}`;
  return `"${str.replace(/"/g, '""')}"`;
}

function triggerCsvDownload(csvContent: string, filename: string): void {
  const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportManagerAttendanceDailyCsv(students: Student[], dateLabel: string): void {
  const headers = ['Smart ID', 'Name', 'Shift', 'Status', 'In Time', 'Out Time'].map(escapeCsvCell).join(',');
  const rows = students
    .map((s) => [s.smartId, s.name, s.shift, s.status ?? 'unmarked', s.inTime || '', s.outTime || ''].map(escapeCsvCell).join(','))
    .join('\r\n');
  triggerCsvDownload(`${headers}\r\n${rows}`, `attendance_register_${dateLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`);
}
