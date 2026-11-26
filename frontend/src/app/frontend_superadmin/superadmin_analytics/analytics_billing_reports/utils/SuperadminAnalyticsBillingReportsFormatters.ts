// utils/SuperadminAnalyticsBillingReportsFormatters.ts
// Formatters and export tools for Superadmin Billing Reports (Rule 80 Minor Unit compliance)

import type { BillingReportTableRecord, BillingReportsOverviewData } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/types/SuperadminAnalyticsBillingReportsTypes';
export { printBillingReportsRoster } from '@/app/frontend_superadmin/superadmin_analytics/analytics_billing_reports/utils/SuperadminAnalyticsBillingReportsPrintUtils';

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
    r.invoiceNumber, r.libraryName, r.branchName, r.planName, r.billingCycle,
    formatBillingCurrency(r.amountMinor), r.paymentStatus, r.paymentMethod, r.transactionId, r.invoiceDate, r.dueDate,
  ]);

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Billing</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; } th { background-color: #312e81; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #4338ca; text-align: left; } td { padding: 6px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f8fafc; }</style>
    </head>
    <body>
      <table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody></table>
    </body>
    </html>
  `.trim();

  triggerBrowserDownload(html, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadBillingReportJson(data: BillingReportsOverviewData, filename = 'billing_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
