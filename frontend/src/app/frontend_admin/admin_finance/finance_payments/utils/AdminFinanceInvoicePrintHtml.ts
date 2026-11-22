import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';

export interface InvoiceCalculations {
  invoiceNumber: string;
  totalAmount: number;
  taxableAmount: number;
  gstAmount: number;
  cgst: number;
  sgst: number;
}

export function calculateInvoiceAmounts(payment: AdminFinancePayment): InvoiceCalculations {
  const invoiceNumber = `INV-${payment.receiptNumber.replace(/^REC-/, '')}`;
  const totalAmount = payment.amount;
  const taxableAmount = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  return {
    invoiceNumber,
    totalAmount,
    taxableAmount,
    gstAmount,
    cgst,
    sgst,
  };
}

export function generateInvoicePrintHtml(payment: AdminFinancePayment, calcs: InvoiceCalculations): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - ${calcs.invoiceNumber}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; }
          .logo-area { font-size: 22px; font-weight: 800; color: #047857; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; background: #dcfce7; color: #166534; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; }
          .card-title { font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b; margin-bottom: 6px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
          th { background: #047857; color: #fff; padding: 10px; text-align: left; font-size: 12px; }
          td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
          .totals-table { width: 280px; margin-left: auto; margin-bottom: 30px; }
          .totals-table td { padding: 6px 10px; }
          .grand-total { font-size: 16px; font-weight: 800; color: #047857; border-top: 2px solid #059669; }
          .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo-area">SMART LIBRARY NETWORK</div>
            <div style="color: #64748b; font-size: 12px; margin-top: 3px;">Branch: ${payment.branch ?? 'Downtown Central'} · GSTIN: 07AABCS1429B1Z8</div>
          </div>
          <div style="text-align: right;">
            <span class="badge">ORIGINAL TAX INVOICE</span>
            <div style="font-size: 16px; font-weight: bold; margin-top: 6px;">${calcs.invoiceNumber}</div>
            <div style="color: #64748b; font-size: 12px;">Date: ${formatDate(payment.date)}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="card">
            <div class="card-title">Billed To (Student)</div>
            <div style="font-size: 14px; font-weight: bold; color: #0f172a;">${payment.studentName}</div>
            <div style="color: #475569; margin-top: 2px;">Smart ID: <strong>${payment.smartId}</strong></div>
            <div style="color: #475569; margin-top: 2px;">Branch Allotted: ${payment.branch ?? 'Downtown Central'}</div>
          </div>
          <div class="card">
            <div class="card-title">Payment Reference</div>
            <div>Mode: <strong>${payment.mode.toUpperCase()}</strong></div>
            <div>Txn Ref: <strong>${payment.txnId || 'Counter / Cash Entry'}</strong></div>
            <div>Status: <strong style="color: #166534;">Paid in Full</strong></div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Service Description</th>
              <th>SAC Code</th>
              <th style="text-align: right;">Taxable Value</th>
              <th style="text-align: right;">CGST (9%)</th>
              <th style="text-align: right;">SGST (9%)</th>
              <th style="text-align: right;">Total (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td><strong>Library Reading Room Access & Desk Subscription</strong><br/><span style="color:#64748b; font-size:11px;">Study seat access, high-speed WiFi, silent study facilities</span></td>
              <td>999293</td>
              <td style="text-align: right;">₹${calcs.taxableAmount.toLocaleString('en-IN')}</td>
              <td style="text-align: right;">₹${calcs.cgst.toLocaleString('en-IN')}</td>
              <td style="text-align: right;">₹${calcs.sgst.toLocaleString('en-IN')}</td>
              <td style="text-align: right; font-weight: bold;">₹${calcs.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <table class="totals-table">
          <tr>
            <td>Taxable Subtotal:</td>
            <td style="text-align: right; font-weight: bold;">₹${calcs.taxableAmount.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>CGST (9%):</td>
            <td style="text-align: right;">₹${calcs.cgst.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>SGST (9%):</td>
            <td style="text-align: right;">₹${calcs.sgst.toLocaleString('en-IN')}</td>
          </tr>
          <tr class="grand-total">
            <td>Total Amount:</td>
            <td style="text-align: right;">₹${calcs.totalAmount.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <div class="footer">
          <p>Smart Library Services Pvt. Ltd. · System Generated Tax Invoice · Thank you for studying with us!</p>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
}
