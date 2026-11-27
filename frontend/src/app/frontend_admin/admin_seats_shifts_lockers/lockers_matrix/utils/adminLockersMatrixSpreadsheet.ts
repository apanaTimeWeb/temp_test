import type { AdminLockersLockerMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/lockers_matrix/types/AdminLockersMatrixTypes';
import { toast } from 'sonner';

export function exportLockersMatrixCsv(visibleLockers: readonly AdminLockersLockerMatrixViewModel[], activeBranchFilter: string) {
  const headers = ['Locker Number', 'Branch', 'Status', 'Assigned Student', 'Smart ID', 'Phone', 'Shift Plan', 'Expiry Date', 'Allotted By', 'Allotted Date'];
  const rows = visibleLockers.map((l) => [
    `"${l.id}"`,
    `"${(l.branchName || 'Downtown Central').replaceAll('"', '""')}"`,
    `"${l.status}"`,
    `"${(l.student || '—').replaceAll('"', '""')}"`,
    `"${l.smartId || '—'}"`,
    `"${l.phone || '—'}"`,
    `"${(l.shift || '—').replaceAll('"', '""')}"`,
    `"${l.expiry || '—'}"`,
    `"${(l.allottedByManager || '—').replaceAll('"', '""')}"`,
    `"${l.allottedDate || '—'}"`,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lockers-allotment-report-${activeBranchFilter.replaceAll(' ', '_')}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${visibleLockers.length} locker records to CSV`, { id: 'admin-lockers-export-csv' });
}

export function exportLockersMatrixExcel(visibleLockers: readonly AdminLockersLockerMatrixViewModel[], activeBranchFilter: string) {
  const headers = ['Locker Number', 'Branch', 'Status', 'Assigned Student', 'Smart ID', 'Phone', 'Shift Plan', 'Expiry Date', 'Allotted By', 'Allotted Date'];
  const rows = visibleLockers.map((l) => [
    `#${l.id}`, l.branchName || 'Downtown Central', l.status, l.student || '—',
    l.smartId || '—', l.phone || '—', l.shift || '—', l.expiry || '—',
    l.allottedByManager || '—', l.allottedDate || '—',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #312e81; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #4338ca; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #eef2ff; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `lockers-allotment-report-${activeBranchFilter.replaceAll(' ', '_')}-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${visibleLockers.length} locker records to Excel (.xls)`, { id: 'admin-lockers-export-excel' });
}
