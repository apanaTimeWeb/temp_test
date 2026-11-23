import type { SuperadminUserData } from '@/app/frontend_superadmin/superadmin_users/users_directory/types/SuperadminUsersDirectoryTypes';
import { maskSensitiveData } from '@/app/frontend_superadmin/superadmin_users/users_directory/utils/SuperadminUsersDirectoryMaskSensitiveData';
export { printSuperadminUsersRoster } from './SuperadminUsersDirectoryPrintUtils';

function quoteCsvCell(value: unknown): string {
  const str = String(value ?? '');
  const formulaSafe = /^[\u0000-\u0020]*[=+\-@]/.test(str) ? `'${str}` : str;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

/** Builds client-side CSV for SuperAdmin users. */
export function buildSuperadminUsersCsv(users: readonly SuperadminUserData[]): string {
  const columns: (keyof SuperadminUserData | 'phone')[] = ['id', 'name', 'username', 'email', 'role', 'branch', 'status', 'twoFactor', 'lastLogin'];
  const headerLabels = ['User ID', 'Full Name', 'Username', 'Email', 'Role', 'Branch/Tenant', 'Status', '2FA Enabled', 'Last Login'];
  const rows = [
    ['DATA CLASSIFICATION: SAMPLE PREVIEW — NOT LIVE USER DATA', ...Array(columns.length - 1).fill('')].map(quoteCsvCell).join(','),
    headerLabels.map(quoteCsvCell).join(','),
    ...users.map((user) => [
      user.id,
      user.name,
      user.username,
      maskSensitiveData(user.email),
      user.role,
      user.branch,
      user.status,
      user.twoFactor ? 'Yes' : 'No',
      user.lastLogin || 'Never',
    ].map(quoteCsvCell).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads CSV file in browser. */
export function downloadSuperadminUsersCsv(users: readonly SuperadminUserData[], filename = 'superadmin_users_export.csv'): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminUsersCsv(users);
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Builds an HTML/XML Excel spreadsheet from user records. */
export function buildSuperadminUsersExcel(users: readonly SuperadminUserData[]): string {
  const headers = ['User ID', 'Full Name', 'Username', 'Email', 'Phone', 'Role', 'Branch / Tenant', 'Status', '2FA Protected', 'Last Login'];
  const rows = users.map((u) => [
    u.id,
    u.name,
    u.username,
    maskSensitiveData(u.email),
    u.phone || '—',
    u.role,
    u.branch,
    u.status,
    u.twoFactor ? 'Enabled' : 'Disabled',
    u.lastLogin || 'Never',
  ]);

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Users</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #312e81; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #4338ca; text-align: left; }
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

/** Downloads Excel (.xls) spreadsheet file in browser. */
export function downloadSuperadminUsersExcel(users: readonly SuperadminUserData[], filename = 'superadmin_users_export.xls'): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminUsersExcel(users);
  const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
