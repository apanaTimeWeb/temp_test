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
  const blob = new Blob([content], { type: mimeType });
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
  const csv = generatePlatformReportCsv(records);
  triggerBrowserFileDownload(csv, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadPlatformReportJson(data: PlatformReportsOverviewData, filename = 'platform_report.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserFileDownload(json, filename, 'application/json;charset=utf-8;');
}
