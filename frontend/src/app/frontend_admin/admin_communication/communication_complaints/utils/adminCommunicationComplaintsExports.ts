import type { Complaint } from '@/app/frontend_admin/admin_communication/communication_complaints/types/AdminCommunicationComplaintsComponentTypes';
import {
  KeyRound,
  Snowflake,
  Tag,
  Volume2,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerDownload(blob: Blob, filename: string): void {
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

export function resolveComplaintCategory(c: Complaint): {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
} {
  const text = `${c.category ?? ''} ${c.title} ${c.description}`.toLowerCase();
  if (text.includes('ac ') || text.includes('cooling') || text.includes('temperature') || text.includes('cassette')) {
    return { label: 'HVAC & Cooling', icon: Snowflake, badgeClass: 'text-info-text border-info bg-info-bg' };
  }
  if (text.includes('wi-fi') || text.includes('wifi') || text.includes('internet') || text.includes('ping') || text.includes('fiber')) {
    return { label: 'Network & Wi-Fi', icon: Wifi, badgeClass: 'text-warning-text border-warning bg-warning-bg' };
  }
  if (text.includes('locker') || text.includes('key') || text.includes('lock') || text.includes('cylinder')) {
    return { label: 'Facility & Lockers', icon: KeyRound, badgeClass: 'text-purple-text border-purple-text bg-purple-bg' };
  }
  if (text.includes('light') || text.includes('led') || text.includes('power') || text.includes('socket') || text.includes('ups')) {
    return { label: 'Electrical & Power', icon: Zap, badgeClass: 'text-warning-text border-warning bg-warning-bg' };
  }
  if (text.includes('whisper') || text.includes('noise') || text.includes('silent') || text.includes('talking')) {
    return { label: 'Discipline & Quiet', icon: Volume2, badgeClass: 'text-danger-text border-danger bg-danger-bg' };
  }
  return { label: c.category || 'General Grievance', icon: Tag, badgeClass: 'text-primary border-border-focus bg-primary-subtle' };
}

export function resolvePriority(c: Complaint): {
  label: string;
  badgeClass: string;
  dotClass: string;
} {
  const p = c.priority || (c.isEscalatedToHq ? 'URGENT' : c.status === 'Open' ? 'HIGH' : 'MEDIUM');
  if (p === 'URGENT') {
    return { label: 'Urgent', badgeClass: 'border-danger bg-danger-bg text-danger-text font-bold', dotClass: 'bg-danger motion-safe:animate-pulse' };
  }
  if (p === 'HIGH') {
    return { label: 'High Priority', badgeClass: 'border-warning bg-warning-bg text-warning-text font-semibold', dotClass: 'bg-warning' };
  }
  if (p === 'MEDIUM') {
    return { label: 'Medium', badgeClass: 'border-info bg-info-bg text-info-text', dotClass: 'bg-info' };
  }
  return { label: 'Standard', badgeClass: 'border-border bg-surface-highlight text-text-secondary', dotClass: 'bg-text-secondary' };
}

export function getStudentInitials(name: string): string {
  if (!name || name === '—') return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function exportComplaintsCsv(filtered: Complaint[]): void {
  const headers = [
    'Ticket ID', 'Title / Grievance Subject', 'Category', 'Priority', 'Complainant Student',
    'Phone', 'Seat / Room', 'Branch', 'Status', 'Date Logged', 'Resolved Date', 'Resolved By', 'Resolution Notes',
  ];
  const rows = filtered.map((c) => [
    c.id,
    `"${c.title.replace(/"/g, '""')}"`,
    `"${c.category ?? 'General'}"`,
    c.priority ?? 'MEDIUM',
    `"${c.student.replace(/"/g, '""')}"`,
    `"${c.studentPhone ?? ''}"`,
    `"${c.seatNumber ?? ''}"`,
    `"${c.branchName ?? ''}"`,
    c.status,
    c.date,
    c.resolvedDate !== '—' ? c.resolvedDate : '',
    `"${c.resolvedBy !== '—' ? c.resolvedBy.replace(/"/g, '""') : ''}"`,
    `"${(c.resolvedNote ?? '').replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.csv`
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
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Complaints</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #e11d48; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #be123c; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #fff1f2; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `.trim();
  triggerDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-complaints-report-${new Date().toISOString().slice(0, 10)}.xls`
  );
}

export function printComplaintsReport(filtered: Complaint[], branchLabel: string): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) return;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Complaints Audit Report</title>
      <style>
        body { font-family: -apple-system, sans-serif; padding: 24px; color: #1e293b; font-size: 12px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 12px; margin-bottom: 16px; }
        .title { font-size: 18px; font-weight: bold; color: #e11d48; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 11px; }
        th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background: #f8fafc; }
        .badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
        .open { background: #fee2e2; color: #b91c1c; }
        .in-prog { background: #fef3c7; color: #b45309; }
        .resolved { background: #dcfce7; color: #15803d; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">SMART LIBRARY NETWORK - GRIEVANCES REPORT</div>
          <div>Branch: ${escapeHtml(branchLabel)}</div>
        </div>
        <div style="text-align: right;">
          <div>Date: ${escapeHtml(new Date().toLocaleDateString('en-IN'))}</div>
          <div>Total Tickets: ${filtered.length}</div>
        </div>
      </div>
      <table>
        <thead>
          <tr><th>Ticket ID</th><th>Student Name</th><th>Seat/Room</th><th>Subject</th><th>Category</th><th>Status</th><th>Date Logged</th><th>Resolution</th></tr>
        </thead>
        <tbody>
          ${filtered.map((c) => `
            <tr>
              <td><strong>${escapeHtml(c.id)}</strong></td>
              <td>${escapeHtml(c.student)}</td>
              <td>${escapeHtml(c.seatNumber ?? '-')}</td>
              <td>${escapeHtml(c.title)}</td>
              <td>${escapeHtml(c.category ?? 'General')}</td>
              <td><span class="badge ${c.status === 'Open' ? 'open' : c.status === 'In Progress' ? 'in-prog' : 'resolved'}">${escapeHtml(c.status)}</span></td>
              <td>${escapeHtml(c.date)}</td>
              <td>${c.status === 'Resolved' ? `${escapeHtml(c.resolvedNote)} (By ${escapeHtml(c.resolvedBy)})` : 'Pending'}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <script>window.onload = function() { window.print(); };</script>
    </body>
    </html>
  `;
  printWindow.document.write(html);
  printWindow.document.close();
}
