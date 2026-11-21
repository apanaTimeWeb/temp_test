// RESPONSIBILITY: Formatting and data utility functions for Superadmin Branch Management.
import type { SuperadminBranchRecord } from '../types/SuperadminBranchesOverviewTypes';

export function formatBranchStatusLabel(status: SuperadminBranchRecord['status']): string {
  switch (status) {
    case 'active':
      return 'Operational';
    case 'suspended':
      return 'Temporarily Suspended';
    case 'deactivated':
      return 'Deactivated';
    case 'closed':
      return 'Archived / Closed';
    default:
      return status;
  }
}

export function formatCurrencyInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function filterBranchesByTerm(
  branches: SuperadminBranchRecord[],
  searchTerm: string,
  libraryId: string,
  status: string,
): SuperadminBranchRecord[] {
  const term = searchTerm.trim().toLowerCase();
  return branches.filter((b) => {
    if (libraryId !== 'all' && b.libraryId !== libraryId) return false;
    if (status !== 'all' && b.status !== status) return false;
    if (!term) return true;
    return (
      b.name.toLowerCase().includes(term) ||
      b.code.toLowerCase().includes(term) ||
      b.city.toLowerCase().includes(term) ||
      b.libraryName.toLowerCase().includes(term) ||
      b.managerName.toLowerCase().includes(term)
    );
  });
}

function quoteCsvCell(value: unknown): string {
  const str = String(value ?? '');
  const formulaSafe = /^[\u0000-\u0020]*[=+\-@]/.test(str) ? `'${str}` : str;
  return `"${formulaSafe.replaceAll('"', '""')}"`;
}

/** Builds RFC-4180 compliant CSV string for Superadmin Branches with UTF-8 BOM. */
export function buildSuperadminBranchesCsv(branches: readonly SuperadminBranchRecord[]): string {
  const headerLabels = ['ID', 'Branch Code', 'Branch Name', 'Tenant / Library', 'City', 'Status', 'Capacity', 'Outstanding Books', 'Member Dues (INR)'];
  const rows = [
    headerLabels.map(quoteCsvCell).join(','),
    ...branches.map((b) => [
      b.id,
      b.code,
      b.name,
      b.libraryName,
      b.city,
      formatBranchStatusLabel(b.status),
      b.capacity,
      b.outstandingBooks,
      b.memberDues,
    ].map(quoteCsvCell).join(',')),
  ];
  return `\uFEFF${rows.join('\r\n')}`;
}

/** Downloads branches CSV file in browser. */
export function downloadSuperadminBranchesCsv(branches: readonly SuperadminBranchRecord[], filename = 'superadmin_branches_export.csv'): void {
  if (typeof window === 'undefined') return;
  const content = buildSuperadminBranchesCsv(branches);
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

/** Builds an HTML/XML Excel spreadsheet from branch records. */
export function buildSuperadminBranchesExcel(branches: readonly SuperadminBranchRecord[]): string {
  const headers = ['ID', 'Branch Code', 'Branch Name', 'Tenant / Library', 'City', 'Status', 'Capacity', 'Outstanding Books', 'Member Dues (INR)'];
  const rows = branches.map((b) => [
    b.id,
    b.code,
    b.name,
    b.libraryName,
    b.city,
    formatBranchStatusLabel(b.status),
    b.capacity,
    b.outstandingBooks,
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

/** Prints branch operations roster in 1 landscape page without overflow. */
export function printSuperadminBranchesRoster(branches: readonly SuperadminBranchRecord[], title = 'SuperAdmin Branch Operations & Capacity Roster'): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=1000,height=700');
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

  const totalCapacity = branches.reduce((acc, b) => acc + (b.capacity || 0), 0);
  const activeCount = branches.filter((b) => b.status === 'active').length;
  const totalDues = branches.reduce((acc, b) => acc + (b.memberDues || 0), 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0369a1; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0369a1; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #0369a1; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-suspended { background: #fef3c7; color: #b45309; }
          .badge-closed { background: #f1f5f9; color: #64748b; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Multi-Tenant Infrastructure & Branch Directory · SuperAdmin Governance</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Branches</span><strong>${branches.length}</strong></div>
          <div class="kpi-chip"><span>Active Branches</span><strong>${activeCount}</strong></div>
          <div class="kpi-chip"><span>Total Seating Capacity</span><strong>${totalCapacity.toLocaleString('en-IN')}</strong></div>
          <div class="kpi-chip"><span>Member Dues</span><strong>${formatCurrencyInr(totalDues)}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">Code</th>
              <th style="width: 22%;">Branch Name</th>
              <th style="width: 20%;">Tenant / Library</th>
              <th style="width: 12%;">City</th>
              <th style="width: 10%;">Status</th>
              <th style="width: 8%;">Capacity</th>
              <th style="width: 9%;">Books</th>
              <th style="width: 9%;">Dues (INR)</th>
            </tr>
          </thead>
          <tbody>
            ${branches.map((b) => `
              <tr>
                <td><strong>${b.code}</strong></td>
                <td>${b.name}</td>
                <td>${b.libraryName}</td>
                <td>${b.city}</td>
                <td><span class="badge ${b.status === 'active' ? 'badge-active' : b.status === 'suspended' ? 'badge-suspended' : 'badge-closed'}">${formatBranchStatusLabel(b.status)}</span></td>
                <td>${b.capacity}</td>
                <td>${b.outstandingBooks}</td>
                <td>${formatCurrencyInr(b.memberDues)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Governance</span>
          <span>Confidential — Internal System Output</span>
        </div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `.trim();

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

