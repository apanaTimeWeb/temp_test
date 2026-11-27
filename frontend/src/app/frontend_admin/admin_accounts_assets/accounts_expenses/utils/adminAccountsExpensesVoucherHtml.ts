import type { AdminAccountingExpense } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/schemas/AdminAccountsExpensesSchemas';
import { escapeExpenseHtml } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/adminAccountsExpensesFilter';
import { formatAdminAccountingCurrency } from '@/app/frontend_admin/admin_accounts_assets/accounts_expenses/utils/AdminAccountsExpensesFormatCurrency';

const VOUCHER_STYLE = `
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
`;

export function buildExpenseVoucherPrintHtml(
  expense: AdminAccountingExpense,
  voucherNo: string,
  vendor: string,
  claimant: string,
  isApproved: boolean,
): string {
  return `
    <!DOCTYPE html><html><head><title>Operational Expense Voucher - ${escapeExpenseHtml(voucherNo)}</title><style>${VOUCHER_STYLE}</style></head>
      <body>
        <div class="header">
          <div><div class="logo">SMART LIBRARY NETWORK</div><div style="font-size: 11px; color: #64748b;">Central Operations & Accounts Division · Branch: ${escapeExpenseHtml(expense.branchName ?? 'Downtown Central')}</div></div>
          <div style="text-align: right;">
            <span class="badge" style="background:#ffe4e6; color:#9f1239;">OPERATIONAL EXPENSE VOUCHER</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${escapeExpenseHtml(voucherNo)}</div>
            <div style="font-size: 10px; color: #64748b;">Date: ${escapeExpenseHtml(expense.date)}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Vendor / Payee Details</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeExpenseHtml(vendor)}</div>
            <div style="color: #475569;">Category: <strong>${escapeExpenseHtml(expense.category)}</strong></div>
            <div style="color: #475569;">Payment Mode: <strong style="text-transform: uppercase;">${escapeExpenseHtml(expense.mode)}</strong></div>
            <div style="color: #475569;">Channel: <strong>${expense.isPettyCashRequest ? 'Petty Cash Counter Release' : 'Direct Account Disbursal'}</strong></div>
          </div>
          <div class="box">
            <div class="box-title">Claimant & Audit Trail</div>
            <div>Requested By: <strong>${escapeExpenseHtml(claimant)}</strong></div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeExpenseHtml(expense.status ?? 'APPROVED')}</strong></div>
            <div>Authorized By: <strong>${escapeExpenseHtml(expense.approvedBy ?? (isApproved ? 'Satyam Gupta (Admin)' : 'Pending Review'))}</strong></div>
            <div>Branch: <strong>${escapeExpenseHtml(expense.branchName ?? 'Downtown Central')}</strong></div>
          </div>
        </div>
        <table><thead><tr><th>Expense Item / Purpose</th><th>Category</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody><tr>
            <td><strong>${escapeExpenseHtml(expense.description)}</strong>${expense.notes ? `<div style="font-size: 10px; color: #64748b; margin-top: 2px;">${escapeExpenseHtml(expense.notes)}</div>` : ''}${expense.rejectionReason ? `<div style="font-size: 10px; color: #dc2626; margin-top: 2px;">Rejection Audit: ${escapeExpenseHtml(expense.rejectionReason)}</div>` : ''}</td>
            <td>${escapeExpenseHtml(expense.category)}</td>
            <td style="text-align: right; font-weight: bold;">${escapeExpenseHtml(formatAdminAccountingCurrency(expense.amount, 'en'))}</td>
          </tr></tbody>
        </table>
        <div class="net-box"><div style="font-size: 11px; color: #9f1239; font-weight: bold;">TOTAL DISBURSED / AUTHORIZED AMOUNT</div><div style="font-size: 20px; font-weight: 800; color: #be123c;">${escapeExpenseHtml(formatAdminAccountingCurrency(expense.amount, 'en'))}</div></div>
        <div class="grid" style="margin-top: 20px;">
          <div class="seal-box"><div style="height: 30px;"></div><div>Prepared & Claimed By</div><div style="font-weight: bold; color: #1e293b;">${escapeExpenseHtml(claimant)}</div></div>
          <div class="seal-box"><div style="height: 30px;"></div><div>Authorized / Approved By</div><div style="font-weight: bold; color: #1e293b;">${escapeExpenseHtml(expense.approvedBy ?? 'Satyam Gupta (Admin)')}</div></div>
        </div>
        <div class="footer" style="margin-top: 15px;"><span>System Generated Financial Voucher · Valid with official signature</span><span>Printed on: ${escapeExpenseHtml(new Date().toLocaleString('en-IN'))}</span></div>
      </body></html>
  `;
}
