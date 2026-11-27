import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';
import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

/** Formats date-only values through date-fns without applying a UTC timestamp conversion. */
export function formatAdminMembersDate(date: string, locale: string, fallback: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fallback;
  const parsed = parseISO(date);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== date) return fallback;
  return format(parsed, 'dd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

function quoteCsvCell(value: string): string {
  const formulaSafeValue = /^[\u0000-\u0020]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${formulaSafeValue.replaceAll('"', '""')}"`;
}

/** Builds a client-side CSV from exactly the provided member rows; the caller must label demo-only sources. */
export function buildAdminMembersDemoCsv(members: readonly AdminMembersMember[]): string {
  const columns: ReadonlyArray<keyof AdminMembersMember> = ['id', 'name', 'email', 'phone', 'plan', 'status', 'expiryDate', 'branch', 'shift', 'seat', 'feeStatus'];
  const rows = [
    columns.map((column) => quoteCsvCell(column)).join(','),
    ...members.map((member) => columns.map((column) => quoteCsvCell(String(member[column] ?? ''))).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads the explicitly-labelled demo CSV; it never implies a server export. */
export function downloadAdminMembersDemoCsv(members: readonly AdminMembersMember[], filename = 'smart-library-members.csv'): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([buildAdminMembersDemoCsv(members)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Builds an HTML/XML Excel spreadsheet from member records. */
export function buildAdminMembersDemoExcel(members: readonly AdminMembersMember[]): string {
  const headers = ['Member ID', 'Full Name', 'Phone', 'Email', 'Branch', 'Plan', 'Seat', 'Shift', 'Locker', 'Status', 'Fee Status', 'Due (INR)', 'Expiry Date'];
  const rows = members.map((m) => [
    m.id, m.name, m.phone, m.email, m.branch || 'Downtown Central', m.plan,
    m.seat || 'Unassigned', m.shift || 'General', m.locker || '—', m.status,
    m.feeStatus || 'Paid', m.dueFeeMinor ? (m.dueFeeMinor / 100).toFixed(2) : '0.00', m.expiryDate || '—',
  ]);
  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #312e81; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
}

/** Downloads an Excel spreadsheet (.xls) directly in the browser. */
export function downloadAdminMembersDemoExcel(members: readonly AdminMembersMember[], filename = 'smart-library-members.xls'): void {
  if (typeof window === 'undefined') return;
  const content = buildAdminMembersDemoExcel(members);
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
