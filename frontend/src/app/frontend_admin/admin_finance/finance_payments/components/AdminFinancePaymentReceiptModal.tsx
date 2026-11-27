'use client';

import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import {
  buildPaymentThermalReceiptHtml,
  openFinanceMailtoClient,
} from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsExports';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { formatAdminFinancePaymentsInr } from '@/app/frontend_admin/admin_finance/finance_payments/utils/formatAdminFinancePaymentsInr';
import {
  buildWhatsAppLink,
  downloadPaymentReceiptPdf,
} from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsPdf';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, Calendar, CheckCircle2, CreditCard, Download, FileCheck, Hash, Mail, Printer, Share2, ShieldCheck, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface AdminFinancePaymentReceiptModalProps {
  payment: AdminFinancePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminFinancePaymentReceiptModal({ payment, isOpen, onClose }: AdminFinancePaymentReceiptModalProps) {
  if (!isOpen || !payment) return null;

  const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=420,height=600');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.open();
    printWindow.document.write(buildPaymentThermalReceiptHtml(payment));
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const text =
      `*SMART LIBRARY - PAYMENT RECEIPT*\n` +
      `---------------------------------\n` +
      `Receipt No: ${payment.receiptNumber}\n` +
      `Date: ${formatDate(payment.date)}\n` +
      `Student Name: ${payment.studentName}\n` +
      `Smart ID: ${payment.smartId}\n` +
      `Branch: ${payment.branch ?? 'Smart Library'}\n` +
      `---------------------------------\n` +
      `Total Paid: ${formattedAmount}\n` +
      `Mode: ${payment.mode.toUpperCase()}\n` +
      (payment.txnId ? `Txn ID: ${payment.txnId}\n` : '') +
      `Status: Verified & Confirmed\n` +
      `Received By: ${payment.receivedBy}\n` +
      `---------------------------------\n` +
      `Thank you for studying with us!`;
    const waUrl = buildWhatsAppLink(payment.studentPhone, text);
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const handleEmailReceipt = () => {
    const email = payment.studentEmail || `${payment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const subject = `Fee Payment Receipt ${payment.receiptNumber} - Smart Library`;
    const body = `Dear ${payment.studentName},\n\nThank you for your fee payment to Smart Library. Below is your official receipt summary:\n\nReceipt No: ${payment.receiptNumber}\nDate: ${formatDate(payment.date)}\nTotal Paid: ${formattedAmount}\nMode: ${payment.mode.toUpperCase()}\nSmart ID: ${payment.smartId}\nBranch: ${payment.branch ?? 'Main Branch'}\nStatus: Paid & Verified\n\nThank you for choosing Smart Library!`;
    openFinanceMailtoClient(email, subject, body);
  };

  const handleDownloadPdf = () => {
    downloadPaymentReceiptPdf(payment);
    toast.success(`Downloaded Payment Receipt PDF (${payment.receiptNumber})`, { id: 'admin-finance-receipt-pdf' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog p-0">
        <div className="bg-primary px-6 py-5 text-on-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                  <FileCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Official Receipt
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  {payment.branch ?? 'Downtown Central'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">Smart Library Receipt</DialogTitle>
              <p className="text-xs opacity-90">
                Receipt Ref: <span className="font-mono font-bold">{payment.receiptNumber}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-on-primary hover:opacity-80 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between rounded-xl bg-success-bg border border-success px-4 py-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-success-text shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold text-success-text">Payment Confirmed &amp; Verified</p>
                <p className="text-caption text-text-secondary">{formatDate(payment.date)}</p>
              </div>
            </div>
            <span className="text-xl font-extrabold text-success-text tabular-nums">{formattedAmount}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-success-bg border border-success px-3.5 py-2 text-xs text-success-text">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>System Auto-Alert:</strong> Sent 1x via Server API upon transaction. Re-shares below use Free WhatsApp Web / Email Client (Zero API Cost).
            </span>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Student &amp; Member Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-secondary flex items-center gap-1"><User className="h-3 w-3" aria-hidden="true" /> Student Name</span>
                <span className="font-semibold text-text-primary mt-0.5 block">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-text-secondary flex items-center gap-1"><Hash className="h-3 w-3" aria-hidden="true" /> Smart ID</span>
                <span className="font-mono font-medium text-text-primary mt-0.5 block">{payment.smartId}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Transaction Breakdown</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-secondary flex items-center gap-1"><CreditCard className="h-3 w-3" aria-hidden="true" /> Payment Mode</span>
                <span className="inline-flex mt-1 items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-bold uppercase text-primary">
                  {payment.mode}
                </span>
              </div>
              <div>
                <span className="text-text-secondary flex items-center gap-1"><Calendar className="h-3 w-3" aria-hidden="true" /> Txn Reference</span>
                <span className="font-mono text-text-primary mt-1 block truncate" title={payment.txnId ?? 'N/A'}>
                  {payment.txnId ?? 'Cash/POS Counter'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block">Late Fee Component</span>
                <span className="font-medium text-text-secondary mt-0.5 block">
                  {payment.lateFee && payment.lateFee > 0 ? formatAdminFinancePaymentsInr(payment.lateFee) : `${formatAdminFinancePaymentsInr(0)} (None)`}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block">Authorized Collector</span>
                <span className="font-medium text-text-secondary mt-0.5 block">{payment.receivedBy}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-caption text-text-secondary">
            This is an electronically generated receipt verified by Smart Library Treasury. No signature required.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-highlight px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Close
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleEmailReceipt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-info bg-info-bg px-3.5 py-2 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Send receipt via default email client (Zero API Cost)"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email Receipt (Free Client)
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3.5 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Share or resend receipt via WhatsApp Web (Zero API Cost)"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share WhatsApp (Free Web)
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg text-success-text hover:opacity-90 px-3.5 py-2 text-xs font-semibold shadow-card motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Download Receipt PDF"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-card hover:bg-primary-hover motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print Receipt (80mm)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
