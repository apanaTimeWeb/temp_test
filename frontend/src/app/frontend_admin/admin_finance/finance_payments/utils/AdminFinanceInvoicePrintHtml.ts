import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import {
  ADMIN_FINANCE_INVOICE_CSS,
  calculateInvoiceAmounts,
  type InvoiceCalculations,
} from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinanceInvoiceCalculations';

export { calculateInvoiceAmounts, type InvoiceCalculations };

export function generateInvoicePrintHtml(payment: AdminFinancePayment, calcs: InvoiceCalculations): string {
  return `
    <!DOCTYPE html><html><head><title>Tax Invoice - ${calcs.invoiceNumber}</title><style>${ADMIN_FINANCE_INVOICE_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="logo-area">SMART LIBRARY NETWORK</div><div style="color: #64748b; font-size: 12px; margin-top: 3px;">Branch: ${payment.branch ?? 'Downtown Central'} · GSTIN: 07AABCS1429B1Z8</div></div>
          <div style="text-align: right;"><span class="badge">ORIGINAL TAX INVOICE</span><div style="font-size: 16px; font-weight: bold; margin-top: 6px;">${calcs.invoiceNumber}</div><div style="color: #64748b; font-size: 12px;">Date: ${formatDate(payment.date)}</div></div>
        </div>
        <div class="info-grid">
          <div class="card"><div class="card-title">Billed To (Student)</div><div style="font-size: 14px; font-weight: bold; color: #0f172a;">${payment.studentName}</div><div style="color: #475569; margin-top: 2px;">Smart ID: <strong>${payment.smartId}</strong></div><div style="color: #475569; margin-top: 2px;">Branch Allotted: ${payment.branch ?? 'Downtown Central'}</div></div>
          <div class="card"><div class="card-title">Payment Reference</div><div>Mode: <strong>${payment.mode.toUpperCase()}</strong></div><div>Txn Ref: <strong>${payment.txnId || 'Counter / Cash Entry'}</strong></div><div>Status: <strong style="color: #166534;">Paid in Full</strong></div></div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Service Description</th><th>SAC Code</th><th style="text-align: right;">Taxable Value</th><th style="text-align: right;">CGST (9%)</th><th style="text-align: right;">SGST (9%)</th><th style="text-align: right;">Total (INR)</th></tr></thead>
          <tbody><tr>
            <td>1</td><td><strong>Library Reading Room Access & Desk Subscription</strong><br/><span style="color:#64748b; font-size:11px;">Study seat access, high-speed WiFi, silent study facilities</span></td><td>999293</td>
            <td style="text-align: right;">₹${calcs.taxableAmount.toLocaleString('en-IN')}</td><td style="text-align: right;">₹${calcs.cgst.toLocaleString('en-IN')}</td><td style="text-align: right;">₹${calcs.sgst.toLocaleString('en-IN')}</td><td style="text-align: right; font-weight: bold;">₹${calcs.totalAmount.toLocaleString('en-IN')}</td>
          </tr></tbody>
        </table>
        <table class="totals-table">
          <tr><td>Taxable Subtotal:</td><td style="text-align: right; font-weight: bold;">₹${calcs.taxableAmount.toLocaleString('en-IN')}</td></tr>
          <tr><td>CGST (9%):</td><td style="text-align: right;">₹${calcs.cgst.toLocaleString('en-IN')}</td></tr>
          <tr><td>SGST (9%):</td><td style="text-align: right;">₹${calcs.sgst.toLocaleString('en-IN')}</td></tr>
          <tr class="grand-total"><td>Total Amount:</td><td style="text-align: right;">₹${calcs.totalAmount.toLocaleString('en-IN')}</td></tr>
        </table>
        <div class="footer"><p>Smart Library Services Pvt. Ltd. · System Generated Tax Invoice · Thank you for studying with us!</p></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
}
