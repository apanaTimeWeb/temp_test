// utils/SuperadminAnalyticsPlatformReportsFormatters.ts
// Formatters and client export utilities for Platform Reports

import type { PlatformReportTableRecord, PlatformReportsOverviewData } from '../types/SuperadminAnalyticsPlatformReportsTypes';
export { printPlatformReportsRoster } from './SuperadminAnalyticsPlatformReportsPrintUtils';

export function formatPlatformReportNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatPlatformReportPercent(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)}%`;
}

export function generatePlatformReportCsv(records: PlatformReportTableRecord[]): string {
  const headers = ['Library ID', 'Library Name', 'Branches', 'City', 'State', 'Admin Name', 'Admin Email', 'Plan', 'Status', 'Payment Status', 'Created Date'];
  const rows = records.map((r) => [
    r.libraryCode, `"${r.libraryName.replace(/"/g, '""')}"`, r.branchCount, `"${r.city}"`, `"${r.state}"`,
    `"${r.adminName}"`, r.adminEmail, r.plan, r.status, r.paymentStatus, r.createdDate,
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
    r.libraryCode, r.libraryName, r.branchCount, r.city, r.state, r.adminName, r.adminEmail, r.plan, r.status, r.paymentStatus, r.createdDate,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Platform</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; } th { background-color: #0284c7; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #0369a1; text-align: left; } td { padding: 6px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f0f9ff; }</style>
    </head>
    <body>
      <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </body>
    </html>
  `.trim();

  triggerBrowserFileDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadPlatformReportJson(data: PlatformReportsOverviewData, filename = 'platform_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserFileDownload(json, filename, 'application/json;charset=utf-8;');
}
