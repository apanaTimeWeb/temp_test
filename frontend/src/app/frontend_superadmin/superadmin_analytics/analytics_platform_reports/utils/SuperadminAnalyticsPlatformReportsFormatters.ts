// utils/SuperadminAnalyticsPlatformReportsFormatters.ts
// Formatters and client export utilities for Platform Reports

import type { PlatformReportTableRecord, PlatformReportsOverviewData } from '../types/SuperadminAnalyticsPlatformReportsTypes';

export function formatPlatformReportNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatPlatformReportPercent(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
}

export function generatePlatformReportCsv(records: PlatformReportTableRecord[]): string {
  const headers = ['Library ID', 'Library Name', 'Branches', 'City', 'State', 'Admin Name', 'Admin Email', 'Plan', 'Status', 'Payment Status', 'Created Date'];
  const rows = records.map((r) => [
    r.libraryCode,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    r.branchCount,
    `"${r.city}"`,
    `"${r.state}"`,
    `"${r.adminName}"`,
    r.adminEmail,
    r.plan,
    r.status,
    r.paymentStatus,
    r.createdDate,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

export function triggerBrowserFileDownload(content: string, filename: string, mimeType: string): void {
  const blob = new Blob(['\uFEFF', content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportPlatformRecordsAsCsv(records: PlatformReportTableRecord[], filename = 'platform_report.csv'): void {
  const csv = generatePlatformReportCsv(records);
  triggerBrowserFileDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportPlatformRecordsAsExcel(records: PlatformReportTableRecord[], filename = 'platform_report.xls'): void {
  const headers = ['Library ID', 'Library Name', 'Branches', 'City', 'State', 'Admin Name', 'Admin Email', 'Plan', 'Status', 'Payment Status', 'Created Date'];
  const rows = records.map((r) => [
    r.libraryCode,
    r.libraryName,
    r.branchCount,
    r.city,
    r.state,
    r.adminName,
    r.adminEmail,
    r.plan,
    r.status,
    r.paymentStatus,
    r.createdDate,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Platform</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #0369a1; text-align: left; }
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

  triggerBrowserFileDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

/** Prints platform reports roster in 1 landscape page without overflow. */
export function printPlatformReportsRoster(records: readonly PlatformReportTableRecord[], title = 'SuperAdmin Platform Tenants & Growth Report'): void {
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

  const activeCount = records.filter((r) => r.status === 'ACTIVE').length;
  const totalBranches = records.reduce((acc, r) => acc + (r.branchCount || 0), 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0284c7; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #0284c7; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .badge-trial { background: #e0f2fe; color: #0369a1; }
          .badge-suspended { background: #fef3c7; color: #b45309; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Multi-Tenant Platform Growth & Library Directory Roster</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Growth Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Tenants</span><strong>${records.length}</strong></div>
          <div class="kpi-chip"><span>Active Libraries</span><strong>${activeCount}</strong></div>
          <div class="kpi-chip"><span>Aggregated Branches</span><strong>${totalBranches}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 11%;">Code</th>
              <th style="width: 21%;">Library Name</th>
              <th style="width: 8%;">Branches</th>
              <th style="width: 12%;">City</th>
              <th style="width: 12%;">State</th>
              <th style="width: 14%;">Admin Name</th>
              <th style="width: 11%;">Plan</th>
              <th style="width: 11%;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r) => `
              <tr>
                <td><strong>${r.libraryCode}</strong></td>
                <td>${r.libraryName}</td>
                <td>${r.branchCount}</td>
                <td>${r.city}</td>
                <td>${r.state}</td>
                <td>${r.adminName}</td>
                <td>${r.plan}</td>
                <td><span class="badge ${r.status === 'ACTIVE' ? 'badge-active' : 'badge-trial'}">${r.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Growth Reports</span>
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

export function downloadPlatformReportJson(data: PlatformReportsOverviewData, filename = 'platform_report.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserFileDownload(json, filename, 'application/json;charset=utf-8;');
}
