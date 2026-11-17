import { format, isValid, parseISO } from 'date-fns';
import { enIN, hi } from 'date-fns/locale';

/** Formats date-only values through date-fns without applying a UTC timestamp conversion. */
export function formatAdminMembersDate(date: string, locale: string, fallback: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fallback;
  const parsed = parseISO(date);
  if (!isValid(parsed) || format(parsed, 'yyyy-MM-dd') !== date) return fallback;
  return format(parsed, 'dd MMM yyyy', { locale: locale.toLowerCase().startsWith('hi') ? hi : enIN });
}

import type { AdminMembersMember } from '@/app/frontend_admin/admin_members/members_directory/schemas/AdminMembersDirectorySchema';

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
    m.id,
    m.name,
    m.phone,
    m.email,
    m.branch || 'Downtown Central',
    m.plan,
    m.seat || 'Unassigned',
    m.shift || 'General',
    m.locker || '—',
    m.status,
    m.feeStatus || 'Paid',
    m.dueFeeMinor ? (m.dueFeeMinor / 100).toFixed(2) : '0.00',
    m.expiryDate || '—',
  ]);

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Members</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #1e1b4b; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #312e81; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
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

/** Prints a clean, high-resolution roster view with letterhead. */
export function printAdminMembersRoster(members: readonly AdminMembersMember[], branchName = 'All Branches'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Member Directory Roster</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 11px; text-align: right; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 10px; }
          td { padding: 6px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-expired { background: #ffe4e6; color: #be123c; }
          .badge-suspended { background: #fef3c7; color: #b45309; }
          .badge-blocked { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Smart Library Network · Member Roster</div>
            <div class="subtitle">Scope: ${branchName} · Total Records: ${members.length}</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Confidential:</strong> Admin Authorized View</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Contact</th>
              <th>Branch</th>
              <th>Plan</th>
              <th>Seat / Shift</th>
              <th>Fee</th>
              <th>Expiry</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${members.map((m) => `
              <tr>
                <td style="font-family: monospace; font-weight: 600;">${m.id}</td>
                <td><strong>${m.name}</strong></td>
                <td>${m.phone || '—'}<br/><span style="color:#64748b; font-size:10px;">${m.email || '—'}</span></td>
                <td>${m.branch || 'Downtown Central'}</td>
                <td>${m.plan}</td>
                <td>${m.seat ? `Seat ${m.seat}` : '—'} · ${m.shift || 'General'}</td>
                <td>${m.feeStatus || 'Paid'}${m.dueFeeMinor ? ` (Due ₹${(m.dueFeeMinor / 100).toFixed(0)})` : ''}</td>
                <td>${m.expiryDate || '—'}</td>
                <td><span class="badge badge-${(m.status || 'Active').toLowerCase()}">${m.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library Administration System</span>
          <span>Page 1 of 1</span>
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
