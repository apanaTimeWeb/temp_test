// utils/SuperadminAnalyticsSecurityReportsFormatters.ts
// Formatters and client-side export utilities for Security Reports

import type { SecurityReportTableRecord, SecurityReportsOverviewData } from '../types/SuperadminAnalyticsSecurityReportsTypes';
export { printSecurityReportsRoster } from './SuperadminAnalyticsSecurityReportsPrintUtils';

export function formatSecurityNumber(val: number): string {
  return new Intl.NumberFormat('en-IN').format(val);
}

export function formatSecurityEventLabel(type: string): string {
  switch (type) {
    case 'UNAUTHORIZED_ACCESS_ATTEMPT': return 'Unauthorized Access Attempt';
    case 'BRUTE_FORCE_LOCKOUT': return 'Brute-Force Lockout';
    case 'IP_BLOCKED': return 'IP Auto-Banned';
    case 'PRIVILEGE_ESCALATION': return 'Privilege Escalation';
    case 'MALICIOUS_PAYLOAD': return 'Malicious Payload Blocked';
    case 'MFA_BYPASS_ATTEMPT': return 'MFA Bypass Attempt';
    case 'SESSION_HIJACK_SUSPECTED': return 'Session Hijack Suspected';
    case 'DATA_EXPORT_BURST': return 'Bulk Data Exfiltration Attempt';
    case 'API_RATE_LIMIT_EXCEEDED': return 'API Abuse Rate Limit';
    case 'SUSPICIOUS_LOCATION_LOGIN': return 'Impossible Travel Login';
    default: return type.replace(/_/g, ' ');
  }
}

export function generateSecurityReportCsv(records: SecurityReportTableRecord[]): string {
  const headers = ['Timestamp', 'Event Type', 'Severity', 'Library Code', 'Library Name', 'Branch', 'Plan', 'Admin / User', 'Email', 'IP Address', 'Location', 'Details'];
  const rows = records.map((r) => [
    r.timestamp,
    `"${formatSecurityEventLabel(r.eventType)}"`,
    r.severity,
    r.libraryCode,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    r.plan,
    `"${r.adminName}"`,
    r.adminEmail,
    r.ipAddress,
    `"${r.location}"`,
    `"${(r.details || '').replace(/"/g, '""')}"`,
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

export function exportSecurityRecordsAsCsv(records: SecurityReportTableRecord[], filename = 'security_report.csv'): void {
  const csv = generateSecurityReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportSecurityRecordsAsExcel(records: SecurityReportTableRecord[], filename = 'security_report.xls'): void {
  const headers = ['Timestamp', 'Event Type', 'Severity', 'Library Code', 'Library Name', 'Branch', 'Plan', 'Admin / User', 'Email', 'IP Address', 'Location', 'Details'];
  const rows = records.map((r) => [
    r.timestamp, formatSecurityEventLabel(r.eventType), r.severity, r.libraryCode, r.libraryName,
    r.branchName, r.plan, r.adminName, r.adminEmail, r.ipAddress, r.location, r.details,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Security</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; } th { background-color: #991b1b; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #b91c1c; text-align: left; } td { padding: 6px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #fef2f2; }</style>
    </head>
    <body>
      <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </body>
    </html>
  `.trim();

  triggerBrowserDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadSecurityReportJson(data: SecurityReportsOverviewData, filename = 'security_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
