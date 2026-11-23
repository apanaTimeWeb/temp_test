// utils/SuperadminAnalyticsUsageReportsFormatters.ts
// Formatters and client-side export utilities for Usage Reports

import type { UsageReportTableRecord, UsageReportsOverviewData } from '../types/SuperadminAnalyticsUsageReportsTypes';
export { printUsageReportsRoster } from './SuperadminAnalyticsUsageReportsPrintUtils';

export function formatUsageNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatStorageSize(megabytes: number): string {
  if (megabytes < 1024) {
    return `${megabytes} MB`;
  }
  const gigabytes = megabytes / 1024;
  if (gigabytes < 1024) {
    return `${gigabytes.toFixed(1)} GB`;
  }
  return `${(gigabytes / 1024).toFixed(2)} TB`;
}

export function generateUsageReportCsv(records: UsageReportTableRecord[]): string {
  const headers = ['Library Code', 'Library Name', 'Plan', 'Branches', 'Active Students', 'Storage Used (MB)', 'Storage Formatted', 'API Calls Today', 'Max Daily Quota'];
  const rows = records.map((r) => [
    r.libraryCode,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    r.plan,
    r.branchCount,
    r.activeStudents,
    r.storageUsedMb,
    formatStorageSize(r.storageUsedMb),
    r.apiCallsToday,
    r.maxApiQuotaDaily,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

export function triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
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

export function exportUsageRecordsAsCsv(records: UsageReportTableRecord[], filename = 'usage_report.csv'): void {
  const csv = generateUsageReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportUsageRecordsAsExcel(records: UsageReportTableRecord[], filename = 'usage_report.xls'): void {
  const headers = ['Library Code', 'Library Name', 'Plan', 'Branches', 'Active Students', 'Storage Used (MB)', 'Storage Formatted', 'API Calls Today', 'Max Daily Quota'];
  const rows = records.map((r) => [
    r.libraryCode, r.libraryName, r.plan, r.branchCount, r.activeStudents, r.storageUsedMb, formatStorageSize(r.storageUsedMb), r.apiCallsToday, r.maxApiQuotaDaily,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Usage</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; } th { background-color: #059669; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #047857; text-align: left; } td { padding: 6px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f0fdf4; }</style>
    </head>
    <body>
      <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </body>
    </html>
  `.trim();

  triggerBrowserDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadUsageReportJson(data: UsageReportsOverviewData, filename = 'usage_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
