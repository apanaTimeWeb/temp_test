// utils/SuperadminAnalyticsSecurityReportsFormatters.ts
// Formatters and client export utilities for Security Reports

import type { SecurityReportTableRecord, SecurityReportsOverviewData } from '../types/SuperadminAnalyticsSecurityReportsTypes';

export function formatSecurityNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatSecurityEventLabel(type: string): string {
  switch (type) {
    case 'LOGIN_SUCCESS':
      return 'Authorized Login';
    case 'LOGIN_FAILED':
      return 'Failed Login Attempt';
    case 'ACCOUNT_LOCKED':
      return 'Account Locked Out';
    case 'PERMISSION_CHANGED':
      return 'Role / Permission Shift';
    case 'DATA_EXPORTED':
      return 'Data Export Triggered';
    case 'SUSPICIOUS_ACTIVITY':
      return 'Suspicious IP Anomaly';
    default:
      return type;
  }
}

export function generateSecurityReportCsv(records: SecurityReportTableRecord[]): string {
  const headers = [
    'Timestamp',
    'Event Type',
    'Severity',
    'Library Code',
    'Library Name',
    'Branch',
    'Plan',
    'Admin / User',
    'Email',
    'IP Address',
    'Location',
    'Details',
  ];

  const rows = records.map((r) => [
    r.timestamp,
    formatSecurityEventLabel(r.eventType),
    r.severity,
    r.libraryCode,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    r.plan,
    `"${r.adminName}"`,
    r.adminEmail,
    r.ipAddress,
    `"${r.location}"`,
    `"${r.details.replace(/"/g, '""')}"`,
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

export function exportSecurityRecordsAsCsv(records: SecurityReportTableRecord[], filename = 'security_report.csv'): void {
  const csv = generateSecurityReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportSecurityRecordsAsExcel(records: SecurityReportTableRecord[], filename = 'security_report.xls'): void {
  const csv = generateSecurityReportCsv(records);
  triggerBrowserDownload(csv, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadSecurityReportJson(data: SecurityReportsOverviewData, filename = 'security_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
