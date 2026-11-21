// utils/SuperadminAnalyticsUsageReportsFormatters.ts
// Formatters and client export utilities for Usage Reports

import type { UsageReportTableRecord, UsageReportsOverviewData } from '../types/SuperadminAnalyticsUsageReportsTypes';

export function formatUsageNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatStorageSize(megabytes: number): string {
  if (megabytes >= 1024 * 1024) {
    return `${(megabytes / (1024 * 1024)).toFixed(2)} TB`;
  }
  if (megabytes >= 1024) {
    return `${(megabytes / 1024).toFixed(1)} GB`;
  }
  return `${megabytes} MB`;
}

export function generateUsageReportCsv(records: UsageReportTableRecord[]): string {
  const headers = [
    'Library Code',
    'Library Name',
    'Branch',
    'Plan',
    'Status',
    'Payment Status',
    'Admin Name',
    'Admin Email',
    'Members',
    'Staff',
    'Storage (MB)',
    'API Calls',
    'SMS Sent',
    'WhatsApp Sent',
    'Last Active',
  ];

  const rows = records.map((r) => [
    r.libraryCode,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    r.plan,
    r.status,
    r.paymentStatus,
    `"${r.adminName}"`,
    r.adminEmail,
    r.membersCount,
    r.staffCount,
    r.storageMb,
    r.apiCalls,
    r.smsCount,
    r.whatsappCount,
    r.lastActiveDate,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

export function triggerBrowserDownload(content: string, filename: string, mimeType: string): void {
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

export function exportUsageRecordsAsCsv(records: UsageReportTableRecord[], filename = 'usage_report.csv'): void {
  const csv = generateUsageReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportUsageRecordsAsExcel(records: UsageReportTableRecord[], filename = 'usage_report.xls'): void {
  const csv = generateUsageReportCsv(records);
  triggerBrowserDownload(csv, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadUsageReportJson(data: UsageReportsOverviewData, filename = 'usage_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
