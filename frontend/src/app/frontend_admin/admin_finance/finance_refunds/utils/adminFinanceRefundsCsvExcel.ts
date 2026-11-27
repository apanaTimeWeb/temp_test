import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { escapeRefundHtml } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsScope';
import { toast } from 'sonner';

const EXPORT_HEADERS = [
  'Ref ID', 'Student Name', 'Smart ID', 'Branch', 'Exit Date',
  'Deposit Held (INR)', 'Deductions (INR)', 'Net Refund (INR)',
  'Status', 'Payment Method', 'Processed Date', 'Rejection Reason',
];

function triggerRefundDownload(blob: Blob, filename: string): void {
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

export function exportAdminFinanceRefundsCsv(refunds: AdminFinanceRefund[], fallbackBranchName?: string): void {
  const rows = refunds.map((r) => [
    r.id,
    `"${r.studentName.replace(/"/g, '""')}"`,
    r.smartId,
    `"${(r.branchName ?? fallbackBranchName ?? 'Downtown Central').replace(/"/g, '""')}"`,
    r.exitDate ? formatDate(r.exitDate) : '—',
    r.depositHeld,
    r.deductionAmount,
    r.netRefund,
    r.status.toUpperCase(),
    r.paymentMethod ? `"${r.paymentMethod.replace(/"/g, '""')}"` : '—',
    r.processedDate ? formatDate(r.processedDate) : '—',
    r.rejectionReason ? `"${r.rejectionReason.replace(/"/g, '""')}"` : '—',
  ]);
  const csv = [EXPORT_HEADERS.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerRefundDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-finance-refunds-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  toast.success(`Exported ${refunds.length} refund records to CSV`, { id: 'refunds-csv-export' });
}

export function exportAdminFinanceRefundsExcel(refunds: AdminFinanceRefund[], fallbackBranchName?: string): void {
  const rows = refunds.map((r) => [
    r.id,
    r.studentName,
    r.smartId,
    r.branchName ?? fallbackBranchName ?? 'Downtown Central',
    r.exitDate ? formatDate(r.exitDate) : '—',
    r.depositHeld,
    r.deductionAmount,
    r.netRefund,
    r.status.toUpperCase(),
    r.paymentMethod ?? '—',
    r.processedDate ? formatDate(r.processedDate) : '—',
    r.rejectionReason ?? '—',
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
      <thead><tr>${EXPORT_HEADERS.map((h) => `<th>${escapeRefundHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeRefundHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  triggerRefundDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-finance-refunds-${new Date().toISOString().slice(0, 10)}.xls`,
  );
  toast.success(`Exported ${refunds.length} refunds to Excel (.xls) for CA/Accounts`, { id: 'refunds-excel-export' });
}
