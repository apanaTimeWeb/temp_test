import type { AdminSeatMatrixSeatMatrixViewModel } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/types/AdminSeatsMatrixTypes';
import {
  buildAdminSeatMatrixSeatMatrixCsv,
  downloadAdminSeatMatrixCsv,
} from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_matrix/utils/AdminSeatsMatrixExportUtils';
import { toast } from 'sonner';

export function exportSeatMatrixCsvFile(visible: readonly AdminSeatMatrixSeatMatrixViewModel[], activeBranchFilter: string, date: string) {
  const rows = [
    ['Seat ID', 'Branch', 'Status', 'Student Name', 'Smart ID', 'Phone', 'Shift', 'Plan', 'Locker', 'Valid From', 'Expires'],
    ...visible.map((seat) => [
      `S-${seat.id}`, seat.branchName || 'Downtown Central', seat.status, seat.student || '—',
      seat.smartId || '—', seat.phone || '—', seat.shift || '—', seat.plan || '—',
      seat.locker || '—', seat.validFrom || '—', seat.expiry || '—',
    ]),
  ];
  const csv = buildAdminSeatMatrixSeatMatrixCsv(rows);
  downloadAdminSeatMatrixCsv(`smart-library-seat-matrix-${activeBranchFilter.replaceAll(' ', '_')}-${date}.csv`, csv);
  toast.success(`Exported ${visible.length} seat records to CSV`, { id: 'admin-seat-matrix-export-csv' });
}

export function exportSeatMatrixExcelFile(visible: readonly AdminSeatMatrixSeatMatrixViewModel[], activeBranchFilter: string, date: string) {
  const headers = ['Seat ID', 'Branch', 'Status', 'Student Name', 'Smart ID', 'Phone', 'Shift', 'Plan', 'Locker', 'Valid From', 'Expires'];
  const rows = visible.map((seat) => [
    `S-${seat.id}`, seat.branchName || 'Downtown Central', seat.status, seat.student || '—',
    seat.smartId || '—', seat.phone || '—', seat.shift || '—', seat.plan || '—',
    seat.locker || '—', seat.validFrom || '—', seat.expiry || '—',
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
  link.download = `smart-library-seat-matrix-${activeBranchFilter.replaceAll(' ', '_')}-${date}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${visible.length} seat records to Excel (.xls)`, { id: 'admin-seat-matrix-export-excel' });
}
