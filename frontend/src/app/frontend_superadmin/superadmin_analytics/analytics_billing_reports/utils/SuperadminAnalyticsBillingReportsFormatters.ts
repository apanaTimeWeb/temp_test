// utils/SuperadminAnalyticsBillingReportsFormatters.ts
// Formatters and export tools for Superadmin Billing Reports (Rule 80 Minor Unit compliance)

import type { BillingReportTableRecord, BillingReportsOverviewData } from '../types/SuperadminAnalyticsBillingReportsTypes';

export function formatBillingCurrency(amountMinor: number, currency = 'INR', locale = 'en-IN'): string {
  const divisor = currency === 'JPY' ? 1 : 100;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountMinor / divisor);
}

export function generateBillingReportCsv(records: BillingReportTableRecord[]): string {
  const headers = ['Invoice No', 'Library Name', 'Branch', 'Plan', 'Billing Cycle', 'Amount (INR)', 'Payment Status', 'Gateway/Method', 'Transaction ID', 'Invoice Date', 'Due Date'];
  const rows = records.map((r) => [
    r.invoiceNumber,
    `"${r.libraryName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    r.planName,
    r.billingCycle,
    (r.amountMinor / 100).toFixed(2),
    r.paymentStatus,
    r.paymentMethod,
    r.transactionId,
    r.invoiceDate,
    r.dueDate,
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

export function exportBillingRecordsAsCsv(records: BillingReportTableRecord[], filename = 'billing_report.csv'): void {
  const csv = generateBillingReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportBillingRecordsAsExcel(records: BillingReportTableRecord[], filename = 'billing_report.xls'): void {
  const headers = ['Invoice No', 'Library Name', 'Branch', 'Plan', 'Billing Cycle', 'Amount (INR)', 'Payment Status', 'Gateway/Method', 'Transaction ID', 'Invoice Date', 'Due Date'];
  const rows = records.map((r) => [
    r.invoiceNumber,
    r.libraryName,
    r.branchName,
    r.planName,
    r.billingCycle,
    formatBillingCurrency(r.amountMinor),
    r.paymentStatus,
    r.paymentMethod,
    r.transactionId,
    r.invoiceDate,
    r.dueDate,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Billing</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #312e81; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #4338ca; text-align: left; }
        td { padding: 6px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f8fafc; }
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

/** Prints billing reports roster in 1 landscape page without overflow. */
export function printBillingReportsRoster(records: readonly BillingReportTableRecord[], title = 'SuperAdmin Billing & Revenue Analytics Report'): void {
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

  const totalAmountMinor = records.reduce((acc, r) => acc + (r.amountMinor || 0), 0);
  const paidCount = records.filter((r) => r.paymentStatus === 'PAID').length;
  const overdueCount = records.filter((r) => r.paymentStatus === 'OVERDUE').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { size: landscape; margin: 8mm 6mm; }
          * { box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 10px; font-size: 8.5pt; line-height: 1.25; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #312e81; padding-bottom: 8px; margin-bottom: 8px; }
          .title { font-size: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #312e81; }
          .subtitle { font-size: 9.5px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 8.5px; text-align: right; color: #475569; }
          .kpi-strip { display: flex; gap: 8px; margin-bottom: 8px; }
          .kpi-chip { flex: 1; padding: 4px 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 8.5px; }
          .kpi-chip strong { font-size: 10.5px; color: #312e81; display: block; }
          table { width: 100%; border-collapse: collapse; font-size: 8pt; table-layout: fixed; }
          th { background-color: #f1f5f9; color: #0f172a; text-align: left; padding: 4px 5px; border: 1px solid #cbd5e1; font-weight: 700; text-transform: uppercase; font-size: 7.5pt; }
          td { padding: 4px 5px; border: 1px solid #e2e8f0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          tr { page-break-inside: avoid; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .badge { display: inline-block; padding: 1px 4px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-paid { background: #dcfce7; color: #15803d; }
          .badge-overdue { background: #fee2e2; color: #b91c1c; }
          .badge-pending { background: #fef3c7; color: #b45309; }
          .footer { margin-top: 10px; font-size: 8px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title}</div>
            <div class="subtitle">Platform Financial Records & Invoice Settlement Roster</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Classification:</strong> Confidential SuperAdmin Financial Export</div>
          </div>
        </div>
        <div class="kpi-strip">
          <div class="kpi-chip"><span>Total Records</span><strong>${records.length}</strong></div>
          <div class="kpi-chip"><span>Gross Billed Value</span><strong>${formatBillingCurrency(totalAmountMinor)}</strong></div>
          <div class="kpi-chip"><span>Settled (PAID)</span><strong>${paidCount}</strong></div>
          <div class="kpi-chip"><span>Overdue Invoices</span><strong>${overdueCount}</strong></div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 11%;">Invoice No</th>
              <th style="width: 21%;">Library Name</th>
              <th style="width: 13%;">Branch</th>
              <th style="width: 9%;">Plan</th>
              <th style="width: 8%;">Cycle</th>
              <th style="width: 10%;">Amount</th>
              <th style="width: 9%;">Status</th>
              <th style="width: 9%;">Method</th>
              <th style="width: 10%;">Date</th>
            </tr>
          </thead>
          <tbody>
            ${records.map((r) => `
              <tr>
                <td><strong>${r.invoiceNumber}</strong></td>
                <td>${r.libraryName}</td>
                <td>${r.branchName}</td>
                <td>${r.planName}</td>
                <td>${r.billingCycle}</td>
                <td>${formatBillingCurrency(r.amountMinor)}</td>
                <td><span class="badge ${r.paymentStatus === 'PAID' ? 'badge-paid' : r.paymentStatus === 'OVERDUE' ? 'badge-overdue' : 'badge-pending'}">${r.paymentStatus}</span></td>
                <td>${r.paymentMethod}</td>
                <td>${r.invoiceDate}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library SaaS System · SuperAdmin Financial Reports</span>
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

export function downloadBillingReportJson(data: BillingReportsOverviewData, filename = 'billing_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
