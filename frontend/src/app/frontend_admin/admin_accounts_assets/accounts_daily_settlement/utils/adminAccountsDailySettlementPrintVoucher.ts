import type { DailySettlementRecord } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/types/AdminAccountsDailySettlementTypes';
import { escapeSettlementHtml } from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/adminAccountsDailySettlementCsvExcel';
import {
  formatPaiseToRupees,
  formatSettlementDate,
} from '@/app/frontend_admin/admin_accounts_assets/accounts_daily_settlement/utils/AdminAccountsDailySettlementFormatters';

const VOUCHER_CSS = `
  @page { size: A5 landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
  .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
  .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
  th { background: #047857; color: #fff; padding: 6px; text-align: left; } td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
  .highlight-row { background: #f0fdf4; font-weight: bold; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; margin-top: 20px; }
  .signature-box { width: 200px; border-top: 1px solid #000; text-align: center; padding-top: 4px; }
`;

export function printDailySettlementVoucher(record: DailySettlementRecord): void {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=750,height=800');
  if (!printWindow) {
    window.print();
    return;
  }
  const isShortage = record.difference < 0;
  const isSurplus = record.difference > 0;
  const html = `
    <!DOCTYPE html><html><head><title>Daily Cash Handover Voucher - ${escapeSettlementHtml(record.branchName)} (${escapeSettlementHtml(record.date)})</title><style>${VOUCHER_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="logo">SMART LIBRARY NETWORK</div><div style="font-size: 11px; color: #64748b;">Daily Cash Closing & Handover Voucher</div></div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">DAILY SETTLEMENT</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Date: ${escapeSettlementHtml(formatSettlementDate(record.date))}</div>
            <div style="font-size: 10px; color: #64748b;">Shift: ${escapeSettlementHtml(record.shiftName)}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Branch & Shift Details</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeSettlementHtml(record.branchName)}</div>
            <div style="color: #475569;">Handed Over By: <strong>${escapeSettlementHtml(record.managerName)}</strong></div>
            ${record.managerNotes ? `<div style="color: #64748b; font-size: 10px; margin-top: 4px;">Notes: ${escapeSettlementHtml(record.managerNotes)}</div>` : ''}
          </div>
          <div class="box">
            <div class="box-title">Audit Status</div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeSettlementHtml(record.status.replace(/_/g, ' '))}</strong></div>
            <div>Approved By: <strong>${escapeSettlementHtml(record.approvedBy ?? 'Pending Audit')}</strong></div>
            ${record.bankReferenceNumber ? `<div>Bank Ref: ${escapeSettlementHtml(record.bankReferenceNumber)}</div>` : ''}
          </div>
        </div>
        <table>
          <thead><tr><th>Cash Ledger Particulars</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody>
            <tr><td>Opening Petty Cash Balance</td><td style="text-align: right; font-family: monospace;">${escapeSettlementHtml(formatPaiseToRupees(record.openingCash))}</td></tr>
            <tr><td>Daily Counter Cash Collected</td><td style="text-align: right; font-family: monospace;">+${escapeSettlementHtml(formatPaiseToRupees(record.cashCollected))}</td></tr>
            <tr><td>Daily UPI / Digital Collections (Direct to Bank)</td><td style="text-align: right; font-family: monospace; color: #4f46e5;">${escapeSettlementHtml(formatPaiseToRupees(record.upiCollected))}</td></tr>
            <tr><td>Petty Cash Expenses Paid</td><td style="text-align: right; font-family: monospace; color: #b91c1c;">-${escapeSettlementHtml(formatPaiseToRupees(record.expensesPaid))}</td></tr>
            <tr style="border-top: 2px solid #cbd5e1;"><td><strong>Expected Drawer Cash</strong></td><td style="text-align: right; font-family: monospace; font-weight: bold;">${escapeSettlementHtml(formatPaiseToRupees(record.expectedClosingCash))}</td></tr>
            <tr class="highlight-row"><td><strong>Actual Cash Handed Over to Admin/Bank</strong></td><td style="text-align: right; font-family: monospace; font-size: 13px; color: #047857;">${escapeSettlementHtml(formatPaiseToRupees(record.actualHandoverCash))}</td></tr>
            <tr><td>Cash Variance (Discrepancy)</td><td style="text-align: right; font-family: monospace; font-weight: bold; color: ${isShortage ? '#b91c1c' : isSurplus ? '#047857' : '#64748b'};">${record.difference === 0 ? '₹0.00 (Exact Match)' : escapeSettlementHtml(formatPaiseToRupees(record.difference))}</td></tr>
            ${record.resolutionAction ? `<tr style="background:#fff1f2;"><td><strong>Discrepancy Resolution Strategy</strong></td><td style="text-align: right; font-weight: bold; color: #9f1239;">${record.resolutionAction === 'DEDUCT_SALARY' ? 'Shortage scheduled for deduction from manager monthly payroll' : record.resolutionAction === 'CARRY_FORWARD' ? 'Shortage carried forward to tomorrow opening balance' : record.resolutionAction === 'IMMEDIATE_DEPOSIT' ? 'Difference reimbursed on spot at counter' : 'Waived as operational loss'}</td></tr>` : ''}
          </tbody>
        </table>
        <div class="footer">
          <div class="signature-box"><span>Branch Manager Signature</span><br/><small style="color: #64748b;">(${escapeSettlementHtml(record.managerName)})</small></div>
          <div class="signature-box"><span>Admin / Auditor Signature</span><br/><small style="color: #64748b;">(Smart Library Treasury)</small></div>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
