import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { toast } from 'sonner';

export function escapeSettlementHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerSettlementDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const SETTLEMENT_HEADERS = [
  'Date', 'Shift', 'Branch', 'Manager', 'Opening Cash (INR)', 'Cash Collected (INR)',
  'UPI Collected (INR)', 'Expenses Paid (INR)', 'Expected Closing (INR)',
  'Actual Handover (INR)', 'Variance (INR)', 'Status', 'Approved By',
];

export function exportDailySettlementsCsv(records: DailySettlementRecord[]): void {
  const rows = records.map((r) => [
    r.date,
    `"${r.shiftName.replace(/"/g, '""')}"`,
    `"${r.branchName.replace(/"/g, '""')}"`,
    `"${r.managerName.replace(/"/g, '""')}"`,
    (r.openingCash / 100).toFixed(2),
    (r.cashCollected / 100).toFixed(2),
    (r.upiCollected / 100).toFixed(2),
    (r.expensesPaid / 100).toFixed(2),
    (r.expectedClosingCash / 100).toFixed(2),
    (r.actualHandoverCash / 100).toFixed(2),
    (r.difference / 100).toFixed(2),
    r.status,
    `"${(r.approvedBy ?? '').replace(/"/g, '""')}"`,
  ]);
  const csv = [SETTLEMENT_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerSettlementDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  toast.success(`Exported ${records.length} settlement records to CSV`, { id: 'daily-settlement-csv-export' });
}

export function exportDailySettlementsExcel(records: DailySettlementRecord[]): void {
  const rows = records.map((r) => [
    r.date,
    r.shiftName,
    r.branchName,
    r.managerName,
    (r.openingCash / 100).toFixed(2),
    (r.cashCollected / 100).toFixed(2),
    (r.upiCollected / 100).toFixed(2),
    (r.expensesPaid / 100).toFixed(2),
    (r.expectedClosingCash / 100).toFixed(2),
    (r.actualHandoverCash / 100).toFixed(2),
    (r.difference / 100).toFixed(2),
    r.status.replace(/_/g, ' '),
    r.approvedBy ?? 'Pending Audit',
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #ecfdf5; }
      </style>
    </head>
    <body><table>
      <thead><tr>${SETTLEMENT_HEADERS.map((h) => `<th>${escapeSettlementHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeSettlementHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  triggerSettlementDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-daily-settlement-history-${new Date().toISOString().slice(0, 10)}.xls`,
  );
  toast.success(`Exported ${records.length} settlement records to Excel (.xls)`, { id: 'daily-settlement-excel-export' });
}
