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
    r.timestamp,
    formatSecurityEventLabel(r.eventType),
    r.severity,
    r.libraryCode,
    r.libraryName,
    r.branchName,
    r.plan,
    r.adminName,
    r.adminEmail,
    r.ipAddress,
    r.location,
    r.details,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Security</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #991b1b; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #b91c1c; text-align: left; }
        td { padding: 6px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #fef2f2; }
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

  triggerBrowserDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

/** Prints security reports roster in 1 landscape page without overflow. */
export function printSecurityReportsRoster(records: readonly SecurityReportTableRecord[], title = 'SuperAdmin Security Audit & Threat Intelligence Report'): void {
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

  const highSeverityCount = records.filter((r) => r.severity === 'HIGH' || r.severity === 'CRITICAL').length;
  const loginFailCount = records.filter((r) => r.eventType === 'LOGIN_FAILED').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #b91c1c; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #b91c1c; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #b91c1c; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-high { background: #fee2e2; color: #b91c1c; }
          .badge-medium { background: #fef3c7; color: #b45309; }
          .badge-low { background: #f1f5f9; color: #475569; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Platform Security Operations & Zero-Trust Audit Roster</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Security Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Events</span><strong>${records.length}</strong></div>
          <div class="kpi-chip"><span>High / Critical Alerts</span><strong>${highSeverityCount}</strong></div>
          <div class="kpi-chip"><span>Failed Auth Events</span><strong>${loginFailCount}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 14%;">Timestamp</th>
              <th style="width: 16%;">Event Type</th>
              <th style="width: 8%;">Severity</th>
              <th style="width: 18%;">Library / Branch</th>
              <th style="width: 14%;">User / Admin</th>
              <th style="width: 12%;">IP Address</th>
              <th style="width: 18%;">Details</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r) => `
              <tr>
                <td>${r.timestamp}</td>
                <td><strong>${formatSecurityEventLabel(r.eventType)}</strong></td>
                <td><span class="badge ${r.severity === 'HIGH' || r.severity === 'CRITICAL' ? 'badge-high' : r.severity === 'MEDIUM' ? 'badge-medium' : 'badge-low'}">${r.severity}</span></td>
                <td>${r.libraryName} (${r.branchName})</td>
                <td>${r.adminName}</td>
                <td>${r.ipAddress}</td>
                <td>${r.details}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Security Audit</span>
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

export function downloadSecurityReportJson(data: SecurityReportsOverviewData, filename = 'security_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
