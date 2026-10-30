import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_invoices/utils/AdminFinanceInvoicesFormat';

export interface AdminFinanceThermalPrintLabels {
  bill: string; date: string; student: string; smartId: string; phone: string;
  shift: string; seat: string; plan: string; payment: string; transaction: string;
  total: string; paid: string; discount: string; balance: string;
}

export interface AdminFinanceThermalPrintPayload {
  type: 'receipt';
  shopName: string;
  branch: string;
  studentName: string;
  smartId: string;
  phone: string;
  shift: string;
  seat: string;
  plan: string;
  billNumber: string;
  date: string;
  totalPayable: number;
  amountPaid: number;
  discount: number;
  balance: number;
  paymentMode: string;
  transactionId?: string;
  /** Complete localized labels supplied explicitly by the owning UI; no English fallback is permitted. */
  labels: AdminFinanceThermalPrintLabels;
}

function escapeAdminFinanceThermalPrintHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

/** Opens a standalone print preview and formats all finance amounts from minor INR units. */
export function AdminFinanceThermalPrint(payload: AdminFinanceThermalPrintPayload): void {
  const printWindow = window.open('', '_blank', 'popup,width=420,height=720');
  if (!printWindow) {
    throw new Error('Printing was blocked by the browser. Allow pop-ups for this site and try again.');
  }

  printWindow.opener = null;
  const labels = payload.labels;
  const rows: ReadonlyArray<readonly [string, string]> = [
    [labels.bill, payload.billNumber], [labels.date, payload.date], [labels.student, payload.studentName],
    [labels.smartId, payload.smartId], [labels.phone, payload.phone], [labels.shift, payload.shift],
    [labels.seat, payload.seat], [labels.plan, payload.plan], [labels.payment, payload.paymentMode],
    [labels.transaction, payload.transactionId ?? '—'],
    [labels.total, formatAdminFinanceCurrency(payload.totalPayable)],
    [labels.paid, formatAdminFinanceCurrency(payload.amountPaid)],
    [labels.discount, formatAdminFinanceCurrency(payload.discount)],
    [labels.balance, formatAdminFinanceCurrency(payload.balance)],
  ];
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeAdminFinanceThermalPrintHtml(payload.shopName)}</title><style>body{font-family:monospace;padding:16px}h2{margin:0 0 8px}p{margin:0 0 12px}.receipt-row{display:flex;justify-content:space-between;gap:12px;padding:3px 0;overflow-wrap:anywhere}.receipt-row b{flex-shrink:0}</style></head><body><h2>${escapeAdminFinanceThermalPrintHtml(payload.shopName)}</h2><p>${escapeAdminFinanceThermalPrintHtml(payload.branch)}</p>${rows.map(([label, value]) => `<div class="receipt-row"><b>${escapeAdminFinanceThermalPrintHtml(label)}</b><span>${escapeAdminFinanceThermalPrintHtml(value ?? '—')}</span></div>`).join('')}<script>window.print();window.onafterprint=window.close;</script></body></html>`;
  printWindow.document.write(html);
  printWindow.document.close();
}
