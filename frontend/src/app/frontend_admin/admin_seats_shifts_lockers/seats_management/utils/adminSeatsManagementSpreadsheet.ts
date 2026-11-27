import type { Seat } from '@/app/frontend_admin/admin_seats_shifts_lockers/seats_management/types/AdminSeatsManagementComponentTypes';
import { toast } from 'sonner';

export function exportMasterSeatsCsv(filtered: readonly Seat[]) {
  const headers = ['Seat Number', 'Branch', 'Status', 'Assigned Student', 'Last Maintenance'];
  const rows = filtered.map((s) => [
    `"${s.seatNo}"`,
    `"${s.branch.replaceAll('"', '""')}"`,
    `"${s.status}"`,
    `"${(s.assignedTo || '—').replaceAll('"', '""')}"`,
    `"${s.lastMaintenance || '—'}"`,
  ]);
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `seats-master-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filtered.length} seats to CSV`, { id: 'admin-seats-management-export-csv' });
}

export function exportMasterSeatsExcel(filtered: readonly Seat[]) {
  const headers = ['Seat Number', 'Branch', 'Status', 'Assigned Student', 'Last Maintenance'];
  const rows = filtered.map((s) => [s.seatNo, s.branch, s.status, s.assignedTo || '—', s.lastMaintenance || '—']);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0e7490; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #155e75; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #ecfeff; }
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
  link.download = `seats-master-inventory-${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Exported ${filtered.length} seats to Excel (.xls)`, { id: 'admin-seats-management-export-excel' });
}
