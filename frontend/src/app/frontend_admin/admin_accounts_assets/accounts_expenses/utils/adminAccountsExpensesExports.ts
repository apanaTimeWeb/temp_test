import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import type {
  AdminAccountsExpensesCategoryFilter,
  AdminAccountsExpensesStatusFilter,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/types/AdminAccountsExpensesComponentTypes';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';
import { toast } from 'sonner';

export type AdminExpenseTimeRange = 'all' | 'today' | 'this_week' | 'this_month' | 'last_month' | 'custom';

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function triggerDownload(blob: Blob, filename: string): void {
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

export function getExpenseTimeRangeLabel(timeRange: AdminExpenseTimeRange): string {
  switch (timeRange) {
    case 'today': return 'Today';
    case 'this_week': return 'This Week';
    case 'this_month': return 'This Month';
    case 'last_month': return 'Last Month';
    case 'custom': return 'Custom Range';
    default: return 'All Time';
  }
}

export function filterAdminExpenses(
  expenses: AdminAccountingExpense[],
  opts: {
    isAllBranches: boolean;
    selectedBranch: { name: string } | null;
    catFilter: AdminAccountsExpensesCategoryFilter;
    statusFilter: AdminAccountsExpensesStatusFilter;
    searchQuery: string;
    timeRange: AdminExpenseTimeRange;
    customStartDate: string;
    customEndDate: string;
  }
): AdminAccountingExpense[] {
  const { isAllBranches, selectedBranch, catFilter, statusFilter, searchQuery, timeRange, customStartDate, customEndDate } = opts;
  return expenses.filter((expense) => {
    if (!isAllBranches && selectedBranch) {
      const matchesBranch = expense.branchName && (
        expense.branchName.toLowerCase().includes(selectedBranch.name.toLowerCase()) ||
        selectedBranch.name.toLowerCase().includes(expense.branchName.toLowerCase())
      );
      if (!matchesBranch) return false;
    }
    if (catFilter !== 'all' && expense.category !== catFilter) return false;
    if (statusFilter !== 'all' && (expense.status ?? 'APPROVED') !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const match =
        expense.description?.toLowerCase().includes(q) ||
        expense.paidBy?.toLowerCase().includes(q) ||
        expense.category?.toLowerCase().includes(q) ||
        expense.branchName?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (timeRange !== 'all' && expense.date) {
      const d = new Date(expense.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (timeRange === 'today') {
        const end = new Date(today);
        end.setHours(23, 59, 59, 999);
        if (!(d >= today && d <= end)) return false;
      } else if (timeRange === 'this_week') {
        const ws = new Date(today);
        ws.setDate(today.getDate() - today.getDay());
        if (d < ws) return false;
      } else if (timeRange === 'this_month') {
        if (d < new Date(today.getFullYear(), today.getMonth(), 1)) return false;
      } else if (timeRange === 'last_month') {
        const lms = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lme = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999);
        if (d < lms || d > lme) return false;
      } else if (timeRange === 'custom') {
        if (customStartDate && d < new Date(customStartDate)) return false;
        if (customEndDate) {
          const ce = new Date(customEndDate);
          ce.setHours(23, 59, 59, 999);
          if (d > ce) return false;
        }
      }
    }
    return true;
  });
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
  triggerDownload(
    new Blob([csv], { type: 'text/csv;charset=utf-8' }),
    `admin-accounting-expenses-${new Date().toISOString().slice(0, 10)}.csv`
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
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Expenses</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #4f46e5; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #4338ca; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #f8fafc; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </body>
    </html>
  `.trim();
  triggerDownload(
    new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' }),
    `admin-accounting-expenses-${new Date().toISOString().slice(0, 10)}.xls`
  );
  toast.success(`Exported ${visibleExpenses.length} expense records to Excel (.xls)`, { id: 'admin-expenses-excel-export' });
}

export function buildExpenseVoucherPrintHtml(
  expense: AdminAccountingExpense,
  voucherNo: string,
  vendor: string,
  claimant: string,
  isApproved: boolean
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Operational Expense Voucher - ${escapeHtml(voucherNo)}</title>
        <style>
          @page { size: A5 landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e11d48; padding-bottom: 8px; margin-bottom: 12px; }
          .logo { font-size: 16px; font-weight: 800; color: #be123c; text-transform: uppercase; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
          .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          th { background: #be123c; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
          td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
          .net-box { background: #fff1f2; border: 2px solid #e11d48; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
          .seal-box { border: 1px dashed #cbd5e1; border-radius: 4px; padding: 10px; text-align: center; font-size: 10px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Central Operations & Accounts Division · Branch: ${escapeHtml(expense.branchName ?? 'Downtown Central')}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#ffe4e6; color:#9f1239;">OPERATIONAL EXPENSE VOUCHER</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${escapeHtml(voucherNo)}</div>
            <div style="font-size: 10px; color: #64748b;">Date: ${escapeHtml(expense.date)}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Vendor / Payee Details</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeHtml(vendor)}</div>
            <div style="color: #475569;">Category: <strong>${escapeHtml(expense.category)}</strong></div>
            <div style="color: #475569;">Payment Mode: <strong style="text-transform: uppercase;">${escapeHtml(expense.mode)}</strong></div>
            <div style="color: #475569;">Channel: <strong>${expense.isPettyCashRequest ? 'Petty Cash Counter Release' : 'Direct Account Disbursal'}</strong></div>
          </div>
          <div class="box">
            <div class="box-title">Claimant & Audit Trail</div>
            <div>Requested By: <strong>${escapeHtml(claimant)}</strong></div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeHtml(expense.status ?? 'APPROVED')}</strong></div>
            <div>Authorized By: <strong>${escapeHtml(expense.approvedBy ?? (isApproved ? 'Satyam Gupta (Admin)' : 'Pending Review'))}</strong></div>
            <div>Branch: <strong>${escapeHtml(expense.branchName ?? 'Downtown Central')}</strong></div>
          </div>
        </div>
        <table>
          <thead><tr><th>Expense Item / Purpose</th><th>Category</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody>
            <tr>
              <td>
                <strong>${escapeHtml(expense.description)}</strong>
                ${expense.notes ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${escapeHtml(expense.notes)}</div>` : ''}
                ${expense.rejectionReason ? `<div style="font-size: 10px; color: #dc2626; margin-top: 2px;">Rejection Audit: ${escapeHtml(expense.rejectionReason)}</div>` : ''}
              </td>
              <td>${escapeHtml(expense.category)}</td>
              <td style="text-align: right; font-weight: bold;">${escapeHtml(formatAdminAccountingCurrency(expense.amount, 'en'))}</td>
            </tr>
          </tbody>
        </table>
        <div class="net-box">
          <div style="font-size: 11px; color: #9f1239; font-weight: bold;">TOTAL DISBURSED / AUTHORIZED AMOUNT</div>
          <div style="font-size: 20px; font-weight: 800; color: #be123c;">${escapeHtml(formatAdminAccountingCurrency(expense.amount, 'en'))}</div>
        </div>
        <div class="grid" style="margin-top: 20px;">
          <div class="seal-box"><div style="height: 30px;"></div><div>Prepared & Claimed By</div><div style="font-weight: bold; color: #1e293b;">${escapeHtml(claimant)}</div></div>
          <div class="seal-box"><div style="height: 30px;"></div><div>Authorized / Approved By</div><div style="font-weight: bold; color: #1e293b;">${escapeHtml(expense.approvedBy ?? 'Satyam Gupta (Admin)')}</div></div>
        </div>
        <div class="footer" style="margin-top: 15px;">
          <span>System Generated Financial Voucher · Valid with official signature</span>
          <span>Printed on: ${escapeHtml(new Date().toLocaleString('en-IN'))}</span>
        </div>
      </body>
    </html>
  `;
}
