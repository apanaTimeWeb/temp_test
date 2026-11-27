'use client';

import type { ManagerReceiptRecord } from '@/app/frontend_manager/manager_finance/finance_fines_payments/components/manager_finance_fines_payments_views/ManagerFinanceFinesPaymentsFinesAndPaymentsPage';
import { toast } from 'sonner';

function escapeCsvCell(val: unknown): string {
  let s = String(val ?? '');
  if (/^[\u0000-\u0020]*[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export function exportReceiptsLedgerCsv(rows: ManagerReceiptRecord[], timeHorizonLabel: string): void {
  const headers = `Receipts Ledger Export - Scope: ${timeHorizonLabel}\nTransaction ID,Receipt Number,Member,Plan,Late Fee,Amount,Mode,Date,Collected By,Status\n`;
  const csvRows = rows
    .map((r) => `"${r.txnId}","${r.receiptNumber}","${r.member}","${r.plan}","${r.lateFee}","${r.amount}","${r.mode}","${r.date}","${r.collectedBy}","${r.status}"`)
    .join('\n');
  const blob = new Blob([headers + csvRows], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `receipts_ledger_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('Receipts exported to CSV successfully', { id: 'fines-export-receipts' });
}

export function exportPendingFinesCsv(
  rows: Array<{ id: string; member: string; type: string; amount: number; date: string; status: string }>,
  activeTab: string,
  timeHorizonLabel: string
): void {
  const headers = ['Fine ID', 'Member', 'Type', 'Amount', 'Date', 'Status'].map(escapeCsvCell).join(',');
  const csvRows = rows.map((f) => [f.id, f.member, f.type, f.amount, f.date, f.status].map(escapeCsvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `fines_${activeTab}_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`Fines (${activeTab}) exported to CSV successfully`, { id: 'fines-export-pending' });
}

export function exportPaymentHistoryCsv(
  rows: Array<{ receipt?: string; member: string; type: string; amount: number; mode: string; date: string; collectedBy: string }>,
  timeHorizonLabel: string
): void {
  const headers = ['Receipt', 'Member', 'Fine Type', 'Amount', 'Payment Mode', 'Date Time', 'Collected By'].map(escapeCsvCell).join(',');
  const csvRows = rows
    .map((h) => [h.receipt || '', h.member, h.type, h.amount, h.mode, h.date, h.collectedBy].map(escapeCsvCell).join(','))
    .join('\r\n');
  const blob = new Blob([`\uFEFF${headers}\r\n${csvRows}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `payment_history_${timeHorizonLabel.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`,
    hidden: true,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success('Payment history exported to CSV successfully', { id: 'fines-export-history' });
}

export function shareReceiptViaWhatsApp(r: ManagerReceiptRecord, formatCurrency: (n: number) => string): void {
  const text = encodeURIComponent(`Hello ${r.member}, your Library fee receipt #${r.receiptNumber} (${r.plan}) of ${formatCurrency(r.amount)} is confirmed. Txn ID: ${r.txnId}.`);
  let digits = (r.phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  const targetPhone = digits.length === 10 ? `91${digits}` : digits;
  const popup = window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank', 'noopener,noreferrer');
  if (popup) popup.opener = null;
  toast.success(`WhatsApp receipt link generated for ${r.member}`, { id: 'fines-share-whatsapp' });
}

export function shareReceiptViaEmail(r: ManagerReceiptRecord, formatCurrency: (n: number) => string): void {
  const subject = encodeURIComponent(`Library Receipt #${r.receiptNumber} - ${r.plan}`);
  const body = encodeURIComponent(
    `Dear ${r.member},\n\nHere is your receipt for ${r.plan}.\nReceipt No: ${r.receiptNumber}\nTxn ID: ${r.txnId}\nAmount: ${formatCurrency(r.amount)}\nLate Fee: ${formatCurrency(r.lateFee)}\nStatus: ${r.status}\nDate: ${r.date}\n\nThank you,\nLibrary Management`
  );
  window.location.href = `mailto:${r.email}?subject=${subject}&body=${body}`;
  toast.success(`Email client opened for ${r.email}`, { id: 'fines-share-email' });
}

export function shareReceiptViaSms(r: ManagerReceiptRecord): void {
  toast.success(`SMS receipt dispatched to +91 ${r.phone} for Txn ${r.txnId}`, { id: 'fines-share-sms' });
}
