import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { toast } from 'sonner';

export function openFinanceMailtoClient(email: string, subject: string, body: string) {
  const anchor = document.createElement('a');
  anchor.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  toast.success(`Opening email client for ${email}`, { id: 'admin-finance-payments-email' });
}

export function exportFinancePaymentsExcel(visible: readonly AdminFinancePayment[]) {
  const headers = ['Receipt No', 'Date', 'Student Name', 'Smart ID', 'Amount (INR)', 'Payment Mode', 'Txn ID', 'Late Fee', 'Received By', 'Status'];
  const rows = visible.map((p) => [
    p.receiptNumber, formatDate(p.date), p.studentName, p.smartId, p.amount,
    p.mode.toUpperCase(), p.txnId || '—', p.lateFee || 0, p.receivedBy, p.status.toUpperCase(),
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
      <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></body></html>
  `.trim();
  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = 'admin-finance-payments.xls';
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
  toast.success(`Exported ${visible.length} payments to Excel (.xls)`, { id: 'admin-finance-payments-export-excel' });
}

export function buildPaymentThermalReceiptHtml(payment: AdminFinancePayment) {
  return `
    <!DOCTYPE html><html><head><title>Receipt - ${payment.receiptNumber}</title>
      <style>
        @page { size: 80mm 200mm; margin: 5mm; }
        body { font-family: 'Courier New', monospace; font-size: 11px; color: #000; margin: 0; padding: 10px; }
        .center { text-align: center; } .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        .row { display: flex; justify-content: space-between; margin: 3px 0; }
        .total-row { font-size: 14px; font-weight: bold; margin: 6px 0; }
        .footer { font-size: 9px; text-align: center; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="center bold" style="font-size: 14px;">SMART LIBRARY SYSTEM</div>
      <div class="center">${payment.branch ?? 'Main Branch'}</div><div class="divider"></div>
      <div class="center bold" style="font-size: 12px;">FEE PAYMENT RECEIPT</div><div class="divider"></div>
      <div class="row"><span>Receipt No:</span><span class="bold">${payment.receiptNumber}</span></div>
      <div class="row"><span>Date:</span><span>${formatDate(payment.date)}</span></div>
      <div class="row"><span>Student:</span><span class="bold">${payment.studentName}</span></div>
      <div class="row"><span>Smart ID:</span><span>${payment.smartId}</span></div><div class="divider"></div>
      <div class="row"><span>Description:</span><span>Subscription Fee</span></div>
      <div class="row"><span>Payment Mode:</span><span class="bold">${payment.mode.toUpperCase()}</span></div>
      ${payment.txnId ? `<div class="row"><span>Txn Ref:</span><span>${payment.txnId}</span></div>` : ''}
      ${payment.lateFee && payment.lateFee > 0 ? `<div class="row"><span>Late Fee:</span><span>₹${payment.lateFee}</span></div>` : ''}
      <div class="divider"></div>
      <div class="row total-row"><span>TOTAL PAID:</span><span>${formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major')}</span></div>
      <div class="divider"></div>
      <div class="row"><span>Received By:</span><span>${payment.receivedBy}</span></div>
      <div class="row"><span>Status:</span><span class="bold">PAID & VERIFIED</span></div>
      <div class="footer"><p>*** Thank You for Choosing Smart Library ***<br/>Knowledge is the best investment.</p></div>
      <script>window.onload = function() { window.print(); };</script>
    </body></html>
  `;
}
