import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { escapeExpenseHtml } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/adminAccountsExpensesFilter';
import { toast } from 'sonner';

function triggerExpenseDownload(blob: Blob, filename: string): void {
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

export function exportAdminExpensesCsv(visibleExpenses: AdminAccountingExpense[]): void {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Amount (INR)', 'Payment Method', 'Paid By', 'Branch', 'Status', 'Approved By', 'Approved Date', 'Voucher / Receipt Ref'];
  const rows = visibleExpenses.map((e) => [
    e.id,
    e.date ?? '',
    `"${(e.description ?? '').replace(/"/g, '""')}"`,
    `"${e.category ?? ''}"`,
    e.amount ?? 0,
    `"${e.mode ?? 'cash'}"`,
    `"${(e.paidBy ?? '').replace(/"/g, '""')}"`,
    `"${(e.branchName ?? '').replace(/"/g, '""')}"`,
    e.status ?? 'APPROVED',
    `"${(e.approvedBy ?? '').replace(/"/g, '""')}"`,
    e.approvedAt ? e.approvedAt.slice(0, 10) : '',
    `"${e.voucherNo ?? `EXP-${e.id}`}"`,
  ]);
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  triggerExpenseDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-accounting-expenses-${new Date().toISOString().slice(0, 10)}.csv`,
  );
  toast.success(`Exported ${visibleExpenses.length} expense records to CSV`, { id: 'admin-expenses-csv-export' });
}

export function exportAdminExpensesExcel(visibleExpenses: AdminAccountingExpense[]): void {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Amount (INR)', 'Payment Method', 'Paid By', 'Branch', 'Status', 'Approved By', 'Voucher / Receipt Ref'];
  const rows = visibleExpenses.map((e) => [
    e.id,
    e.date ?? '',
    e.description ?? '',
    e.category ?? '',
    `₹${e.amount ?? 0}`,
    e.mode ?? 'cash',
    e.paidBy ?? '',
    e.branchName ?? '',
    e.status ?? 'APPROVED',
    e.approvedBy ?? 'Admin',
    e.voucherNo ?? `EXP-${e.id}`,
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #4f46e5; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #4338ca; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; } tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body><table>
      <thead><tr>${headers.map((h) => `<th>${escapeExpenseHtml(h)}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeExpenseHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  triggerExpenseDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-accounting-expenses-${new Date().toISOString().slice(0, 10)}.xls`,
  );
  toast.success(`Exported ${visibleExpenses.length} expense records to Excel (.xls)`, { id: 'admin-expenses-excel-export' });
}
