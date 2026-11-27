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
    p.receiptNumber,
    formatDate(p.date),
    p.studentName,
    p.smartId,
    p.amount,
    p.mode.toUpperCase(),
    p.txnId || '—',
    p.lateFee || 0,
    p.receivedBy,
    p.status.toUpperCase(),
  ]);
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Payments</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 12px; }
        th { background-color: #047857; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #065f46; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; }
        tr:nth-child(even) { background-color: #ecfdf5; }
      </style>
    </head>
    <body>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${String(cell ?? '').replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </body>
    </html>
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

export function printFinancePaymentsLedger(
  visible: readonly AdminFinancePayment[],
  branchLabel: string,
  timeRangeLabel: string,
  totalCollected: string,
) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Smart Library - Fee Collections & Payments Ledger</title>
        <style>
          @page { size: landscape; margin: 10mm; }
          body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.5px; }
          .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
          .meta { font-size: 11px; text-align: right; color: #475569; }
          table { width: 100%; border-collapse: collapse; font-size: 11px; }
          th { background-color: #d1fae5; color: #065f46; text-align: left; padding: 6px; border: 1px solid #a7f3d0; font-weight: 700; text-transform: uppercase; font-size: 10px; }
          td { padding: 6px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f0fdf4; }
          .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
          .badge-valid { background: #dcfce7; color: #15803d; }
          .badge-deleted { background: #fee2e2; color: #b91c1c; }
          .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Smart Library Network · Payments & Receipts Ledger</div>
            <div class="subtitle">Scope: ${branchLabel} · Range: ${timeRangeLabel} · Records: ${visible.length}</div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Total Collected:</strong> ${totalCollected}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Receipt #</th>
              <th>Date</th>
              <th>Student Name</th>
              <th>Smart ID</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Txn ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${visible.map((p) => `
              <tr>
                <td style="font-family:monospace; font-weight:bold;">${p.receiptNumber}</td>
                <td>${formatDate(p.date)}</td>
                <td><strong>${p.studentName}</strong></td>
                <td>${p.smartId}</td>
                <td>${formatAdminFinanceApiAmount(p.amount, p.currencyCode, p.amountUnit)}</td>
                <td>${p.mode.toUpperCase()}</td>
                <td>${p.txnId || '—'}</td>
                <td><span class="badge badge-${p.status}">${p.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <span>Smart Library Treasury & Accounts</span>
          <span>Page 1 of 1</span>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}

export function buildPaymentThermalReceiptHtml(payment: AdminFinancePayment) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt - ${payment.receiptNumber}</title>
        <style>
          @page { size: 80mm 200mm; margin: 5mm; }
          body { font-family: 'Courier New', monospace; font-size: 11px; color: #000; margin: 0; padding: 10px; }
          .center { text-align: center; }
          .bold { font-weight: bold; }
          .divider { border-top: 1px dashed #000; margin: 8px 0; }
          .row { display: flex; justify-content: space-between; margin: 3px 0; }
          .total-row { font-size: 14px; font-weight: bold; margin: 6px 0; }
          .footer { font-size: 9px; text-align: center; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="center bold" style="font-size: 14px;">SMART LIBRARY SYSTEM</div>
        <div class="center">${payment.branch ?? 'Main Branch'}</div>
        <div class="divider"></div>
        <div class="center bold" style="font-size: 12px;">FEE PAYMENT RECEIPT</div>
        <div class="divider"></div>
        <div class="row"><span>Receipt No:</span><span class="bold">${payment.receiptNumber}</span></div>
        <div class="row"><span>Date:</span><span>${formatDate(payment.date)}</span></div>
        <div class="row"><span>Student:</span><span class="bold">${payment.studentName}</span></div>
        <div class="row"><span>Smart ID:</span><span>${payment.smartId}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Description:</span><span>Subscription Fee</span></div>
        <div class="row"><span>Payment Mode:</span><span class="bold">${payment.mode.toUpperCase()}</span></div>
        ${payment.txnId ? `<div class="row"><span>Txn Ref:</span><span>${payment.txnId}</span></div>` : ''}
        ${payment.lateFee && payment.lateFee > 0 ? `<div class="row"><span>Late Fee:</span><span>₹${payment.lateFee}</span></div>` : ''}
        <div class="divider"></div>
        <div class="row total-row"><span>TOTAL PAID:</span><span>${formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major')}</span></div>
        <div class="divider"></div>
        <div class="row"><span>Received By:</span><span>${payment.receivedBy}</span></div>
        <div class="row"><span>Status:</span><span class="bold">PAID & VERIFIED</span></div>
        <div class="footer">
          <p>*** Thank You for Choosing Smart Library ***<br/>Knowledge is the best investment.</p>
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
    </html>
  `;
}
