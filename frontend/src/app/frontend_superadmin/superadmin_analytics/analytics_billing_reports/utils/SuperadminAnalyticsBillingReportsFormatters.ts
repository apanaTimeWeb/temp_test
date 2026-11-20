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

export function exportBillingRecordsAsCsv(records: BillingReportTableRecord[], filename = 'billing_report.csv'): void {
  const csv = generateBillingReportCsv(records);
  triggerBrowserDownload(csv, filename, 'text/csv;charset=utf-8;');
}

export function exportBillingRecordsAsExcel(records: BillingReportTableRecord[], filename = 'billing_report.xls'): void {
  const csv = generateBillingReportCsv(records);
  triggerBrowserDownload(csv, filename, 'application/vnd.ms-excel;charset=utf-8;');
}

export function downloadBillingReportJson(data: BillingReportsOverviewData, filename = 'billing_summary.json'): void {
  const json = JSON.stringify(data, null, 2);
  triggerBrowserDownload(json, filename, 'application/json;charset=utf-8;');
}
