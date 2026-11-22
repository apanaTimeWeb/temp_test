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
  const headers = ['Library Code', 'Library Name', 'Branch', 'Plan', 'Status', 'Payment Status', 'Admin Name', 'Admin Email', 'Members', 'Staff', 'Storage (MB)', 'API Calls', 'SMS Sent', 'WhatsApp Sent', 'Last Active'];
  const rows = records.map((r) => [
    r.libraryCode,
    r.libraryName,
    r.branchName,
    r.plan,
    r.status,
    r.paymentStatus,
    r.adminName,
    r.adminEmail,
    r.membersCount,
    r.staffCount,
    r.storageMb,
    r.apiCalls,
    r.smsCount,
    r.whatsappCount,
    r.lastActiveDate,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Usage</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #0d9488; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #0f766e; text-align: left; }
        td { padding: 6px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f0fdfa; }
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

/** Prints usage reports roster in 1 landscape page without overflow. */
export function printUsageReportsRoster(records: readonly UsageReportTableRecord[], title = 'SuperAdmin System Resource & API Usage Report'): void {
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

  const totalMembers = records.reduce((acc, r) => acc + (r.membersCount || 0), 0);
  const totalStorageMb = records.reduce((acc, r) => acc + (r.storageMb || 0), 0);
  const totalApiCalls = records.reduce((acc, r) => acc + (r.apiCalls || 0), 0);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #0d9488; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #0d9488; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-active { background: #dcfce7; color: #15803d; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Platform Consumption, Storage & API Telemetry Roster</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Resource Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Tenants</span><strong>${records.length}</strong></div>
          <div class="kpi-chip"><span>Platform Students / Members</span><strong>${totalMembers.toLocaleString('en-IN')}</strong></div>
          <div class="kpi-chip"><span>Total Storage Consumed</span><strong>${formatStorageSize(totalStorageMb)}</strong></div>
          <div class="kpi-chip"><span>Aggregated API Calls</span><strong>${totalApiCalls.toLocaleString('en-IN')}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 9%;">Code</th>
              <th style="width: 19%;">Library Name</th>
              <th style="width: 11%;">Branch</th>
              <th style="width: 9%;">Plan</th>
              <th style="width: 8%;">Members</th>
              <th style="width: 7%;">Staff</th>
              <th style="width: 9%;">Storage</th>
              <th style="width: 9%;">API Calls</th>
              <th style="width: 10%;">SMS / WA</th>
              <th style="width: 9%;">Last Active</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r) => `
              <tr>
                <td><strong>${r.libraryCode}</strong></td>
                <td>${r.libraryName}</td>
                <td>${r.branchName}</td>
                <td>${r.plan}</td>
                <td>${r.membersCount.toLocaleString('en-IN')}</td>
                <td>${r.staffCount}</td>
                <td>${formatStorageSize(r.storageMb)}</td>
                <td>${r.apiCalls.toLocaleString('en-IN')}</td>
                <td>${(r.smsCount + r.whatsappCount).toLocaleString('en-IN')}</td>
                <td>${r.lastActiveDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Usage Reports</span>
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

export function downloadUsageReportJson(data: UsageReportsOverviewData, filename = 'usage_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
