import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';

const LEDGER_PRINT_CSS = `
  @page { size: landscape; margin: 10mm; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 12px; }
  .title { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #047857; letter-spacing: 0.5px; }
  .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; } .meta { font-size: 11px; text-align: right; color: #475569; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { background-color: #d1fae5; color: #065f46; text-align: left; padding: 6px; border: 1px solid #a7f3d0; font-weight: 700; text-transform: uppercase; font-size: 10px; }
  td { padding: 6px; border: 1px solid #e2e8f0; } tr:nth-child(even) { background-color: #f0fdf4; }
  .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
  .badge-valid { background: #dcfce7; color: #15803d; } .badge-deleted { background: #fee2e2; color: #b91c1c; }
  .footer { margin-top: 14px; font-size: 10px; color: #94a3b8; display: flex; justify-content: space-between; border-top: 1px solid #e2e8f0; padding-top: 6px; }
`;

function escapeLedgerHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function printFinancePaymentsLedger(
  visible: readonly AdminFinancePayment[],
  branchLabel: string,
  timeRangeLabel: string,
  totalCollected: string,
) {
  if (typeof window === 'undefined') return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.opener = null;
  const dateStr = escapeLedgerHtml(new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }));
  const html = `
    <!DOCTYPE html><html><head><title>Smart Library - Fee Collections & Payments Ledger</title><style>${LEDGER_PRINT_CSS}</style></head>
      <body>
        <div class="header">
          <div><div class="title">Smart Library Network · Payments & Receipts Ledger</div><div class="subtitle">Scope: ${escapeLedgerHtml(branchLabel)} · Range: ${escapeLedgerHtml(timeRangeLabel)} · Records: ${visible.length}</div></div>
          <div class="meta"><div><strong>Generated:</strong> ${dateStr}</div><div><strong>Total Collected:</strong> ${escapeLedgerHtml(totalCollected)}</div></div>
        </div>
        <table>
          <thead><tr><th>Receipt #</th><th>Date</th><th>Student Name</th><th>Smart ID</th><th>Amount</th><th>Mode</th><th>Txn ID</th><th>Status</th></tr></thead>
          <tbody>
            ${visible.map((p) => `
              <tr>
                <td style="font-family:monospace; font-weight:bold;">${escapeLedgerHtml(p.receiptNumber)}</td>
                <td>${escapeLedgerHtml(formatDate(p.date))}</td>
                <td><strong>${escapeLedgerHtml(p.studentName)}</strong></td>
                <td>${escapeLedgerHtml(p.smartId)}</td>
                <td>${escapeLedgerHtml(formatAdminFinanceApiAmount(p.amount, p.currencyCode, p.amountUnit))}</td>
                <td>${escapeLedgerHtml(p.mode.toUpperCase())}</td>
                <td>${escapeLedgerHtml(p.txnId || '—')}</td>
                <td><span class="badge badge-${escapeLedgerHtml(p.status)}">${escapeLedgerHtml(p.status)}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer"><span>Smart Library Treasury & Accounts</span><span>Page 1 of 1</span></div>
        <script>window.onload = function() { window.print(); };</script>
      </body></html>
  `;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
