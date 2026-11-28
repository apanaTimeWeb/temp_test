import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';

function escapeComplaintHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerComplaintDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapeComplaintCsvCell(value: unknown): string {
  const text = String(value ?? '');
  const isFiniteNumber = typeof value === 'number' && Number.isFinite(value);
  const safeText = !isFiniteNumber && /^[\u0000-\u0020]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export function exportComplaintsCsv(filtered: Complaint[]): void {
  const headers = [
    'Ticket ID', 'Title / Grievance Subject', 'Category', 'Priority', 'Complainant Student',
    'Phone', 'Seat / Room', 'Branch', 'Status', 'Date Logged', 'Resolved Date', 'Resolved By', 'Resolution Notes',
  ];
  const rows = filtered.map((c) => [
    c.id,
    c.title,
    c.category ?? 'General',
    c.priority ?? 'MEDIUM',
    c.student,
    c.studentPhone ?? '',
    c.seatNumber ?? '',
    c.branchName ?? '',
    c.status,
    c.date,
    c.resolvedDate !== '—' ? c.resolvedDate : '',
    c.resolvedBy !== '—' ? c.resolvedBy : '',
    c.resolvedNote ?? '',
  ].map(escapeComplaintCsvCell));
  const csv = [headers.map(escapeComplaintCsvCell).join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerComplaintDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.csv`,
  );
}

export function exportComplaintsExcel(filtered: Complaint[]): void {
  const headers = [
    'Ticket ID', 'Subject', 'Category', 'Priority', 'Student', 'Phone',
    'Seat/Room', 'Branch', 'Status', 'Date Logged', 'Resolved Date', 'Resolved By', 'Resolution Notes',
  ];
  const rows = filtered.map((c) => [
    c.id, c.title, c.category ?? 'General', c.priority ?? 'MEDIUM', c.student,
    c.studentPhone ?? '-', c.seatNumber ?? '-', c.branchName ?? 'Downtown Central',
    c.status, c.date, c.resolvedDate, c.resolvedBy, c.resolvedNote || '-',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #e11d48; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #be123c; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #fff1f2; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${escapeComplaintHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeComplaintHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  triggerComplaintDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.xls`,
  );
}

export function printComplaintsReport(filtered: Complaint[], branchLabel: string): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=800');
  if (!printWindow) return;
  printWindow.opener = null;
  const html = `
    <!DOCTYPE html><html><head><title>Student Complaints Audit Report</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 24px; color: #1e293b; font-size: 12px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px; }
        .title { font-size: 18px; font-weight: bold; color: #e11d48; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background: #f8fafc; }
        .badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .open { background: #fee2e2; color: #b91c1c; } .in-prog { background: #fef3c7; color: #b45309; } .resolved { background: #dcfce7; color: #15803d; }
      </style>
    </head>
    <body>
      <div class="header"><div><div class="title">SMART LIBRARY NETWORK - GRIEVANCES REPORT</div><div>Branch: ${escapeComplaintHtml(branchLabel)}</div></div>
      <div style="text-align: right;"><div>Date: ${escapeComplaintHtml(new Date().toLocaleDateString('en-IN'))}</div><div>Total Tickets: ${filtered.length}</div></div></div>
      <table><thead><tr><th>Ticket ID</th><th>Student Name</th><th>Seat/Room</th><th>Subject</th><th>Category</th><th>Status</th><th>Date Logged</th><th>Resolution</th></tr></thead>
      <tbody>${filtered.map((c) => `<tr><td><strong>${escapeComplaintHtml(c.id)}</strong></td><td>${escapeComplaintHtml(c.student)}</td><td>${escapeComplaintHtml(c.seatNumber ?? '-')}</td><td>${escapeComplaintHtml(c.title)}</td><td>${escapeComplaintHtml(c.category ?? 'General')}</td><td><span class="badge ${c.status === 'Open' ? 'open' : c.status === 'In Progress' ? 'in-prog' : 'resolved'}">${escapeComplaintHtml(c.status)}</span></td><td>${escapeComplaintHtml(c.date)}</td><td>${c.status === 'Resolved' ? `${escapeComplaintHtml(c.resolvedNote)} (By ${escapeComplaintHtml(c.resolvedBy)})` : 'Pending'}</td></tr>`).join('')}</tbody></table>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}
