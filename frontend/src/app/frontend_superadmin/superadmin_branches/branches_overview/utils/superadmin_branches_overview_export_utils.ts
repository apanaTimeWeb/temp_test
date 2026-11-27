import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import { formatBranchStatusLabel, formatCurrencyInr } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/utils/superadmin_branches_overview_utils';

/** Builds an HTML/XML Excel spreadsheet from branch records. */
export function buildSuperadminBranchesExcel(branches: readonly SuperadminBranchRecord[]): string {
  const headers = ['ID', 'Branch Code', 'Branch Name', 'Tenant / Library', 'City', 'Status', 'Capacity', 'Enrolled Students', 'Member Dues (INR)'];
  const rows = branches.map((b) => [
    b.id,
    b.code,
    b.name,
    b.libraryName,
    b.city,
    formatBranchStatusLabel(b.status),
    b.capacity,
    b.activeMembers,
    formatCurrencyInr(b.memberDues),
  ]);

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Branches</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0369a1; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #0284c7; text-align: left; }
        td { padding: 6px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f0f9ff; }
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

/** Downloads Excel (.xls) spreadsheet file for branches. */
export function downloadSuperadminBranchesExcel(branches: readonly SuperadminBranchRecord[], filename = 'superadmin_branches_export.xls'): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminBranchesExcel(branches);
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
