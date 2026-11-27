import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatDate } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/AdminFinanceRefundsFormat';
import { escapeRefundHtml } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/adminFinanceRefundsScope';

const REFUND_PRINT_CSS = `
  @page { size: A5 landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
  .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
  .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
  .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
  th { background: #047857; color: #fff; padding: 6px; text-align: left; font-size: 11px; }
  td { padding: 6px; border-bottom: 1px solid #e2e8f0; font-size: 11px; }
  .net-box { background: #ecfdf5; border: 2px solid #059669; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
  .footer { border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; }
`;

export function buildRefundDetailPrintHtml(refund: AdminFinanceRefund): string {
  const settledDate = refund.disbursedAt || refund.processedDate;
  return `
    <!DOCTYPE html><html><head><title>Security Deposit Refund Voucher - ${escapeRefundHtml(refund.id)}</title><style>${REFUND_PRINT_CSS}</style></head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SMART LIBRARY NETWORK</div>
            <div style="font-size: 11px; color: #64748b;">Treasury & Security Deposit Settlement Division · Branch: ${escapeRefundHtml(refund.branchName ?? 'Downtown Central')}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge" style="background:#dcfce7; color:#15803d;">REFUND SETTLEMENT VOUCHER</span>
            <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Ref: ${escapeRefundHtml(refund.id)}</div>
            <div style="font-size: 10px; color: #64748b;">Exit Date: ${refund.exitDate ? escapeRefundHtml(formatDate(refund.exitDate)) : 'N/A'}</div>
          </div>
        </div>
        <div class="grid">
          <div class="box">
            <div class="box-title">Student Information</div>
            <div style="font-size: 13px; font-weight: bold;">${escapeRefundHtml(refund.studentName)}</div>
            <div style="color: #475569;">Smart ID: <strong>${escapeRefundHtml(refund.smartId)}</strong></div>
            <div style="color: #475569;">Branch: ${escapeRefundHtml(refund.branchName ?? 'Downtown Central')}</div>
          </div>
          <div class="box">
            <div class="box-title">Settlement & Banking Details</div>
            <div>Receipt No: <strong>${escapeRefundHtml(refund.receiptNumber ?? `RCT-REF-${refund.id}`)}</strong></div>
            <div>Transaction UTR: <strong style="font-family: monospace; color: #4338ca;">${escapeRefundHtml(refund.transactionUtr ?? 'Pending Transfer')}</strong></div>
            <div>Method: <strong>${escapeRefundHtml(refund.paymentMethod ?? 'Direct UPI Transfer')}</strong></div>
            <div>Status: <strong style="text-transform: uppercase;">${escapeRefundHtml(refund.status)}</strong></div>
            ${settledDate ? `<div>Settled Date: ${escapeRefundHtml(formatDate(settledDate))}</div>` : ''}
          </div>
        </div>
        <table>
          <thead><tr><th>Item Description</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
          <tbody>
            <tr><td>Initial Security Deposit Held</td><td style="text-align: right; font-weight: bold;">₹${refund.depositHeld.toLocaleString('en-IN')}</td></tr>
            <tr><td>Deductions (Damages / Key replacement / Dues)</td><td style="text-align: right; color: ${refund.deductionAmount > 0 ? '#b91c1c' : '#64748b'};">${refund.deductionAmount > 0 ? `-₹${refund.deductionAmount.toLocaleString('en-IN')}` : '₹0 (None)'}</td></tr>
            ${refund.rejectionReason ? `<tr><td colspan="2" style="color:#b91c1c;"><strong>Reason:</strong> ${escapeRefundHtml(refund.rejectionReason)}</td></tr>` : ''}
          </tbody>
        </table>
        <div class="net-box">
          <span style="font-size: 12px; color: #065f46; font-weight: bold;">NET REFUND DISBURSED: </span>
          <span style="font-size: 18px; font-weight: 800; color: #047857;">₹${refund.netRefund.toLocaleString('en-IN')}</span>
        </div>
        <div class="footer"><span>Verified by Smart Library Branch Accounts</span><span>Authorized Signature: ____________________</span></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
}
