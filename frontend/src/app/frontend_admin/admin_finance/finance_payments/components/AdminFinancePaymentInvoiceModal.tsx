'use client';

import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { calculateInvoiceAmounts, generateInvoicePrintHtml } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinanceInvoicePrintHtml';
import { openFinanceMailtoClient } from '@/app/frontend_admin/admin_finance/finance_payments/utils/adminFinancePaymentsExports';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { buildWhatsAppLink, downloadPaymentInvoicePdf } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Building2, CheckCircle2, Download, FileText, Mail, Printer, Share2, ShieldCheck, User, X } from 'lucide-react';
import { toast } from 'sonner';

interface AdminFinancePaymentInvoiceModalProps {
  payment: AdminFinancePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminFinancePaymentInvoiceModal({ payment, isOpen, onClose }: AdminFinancePaymentInvoiceModalProps) {
  if (!isOpen || !payment) return null;

  const calcs = calculateInvoiceAmounts(payment);
  const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = generateInvoicePrintHtml(payment, calcs);
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const text =
      `*SMART LIBRARY - TAX INVOICE*\n` +
      `---------------------------------\n` +
      `Invoice No: ${calcs.invoiceNumber}\n` +
      `Receipt Ref: ${payment.receiptNumber}\n` +
      `Date: ${formatDate(payment.date)}\n` +
      `Student Name: ${payment.studentName}\n` +
      `Smart ID: ${payment.smartId}\n` +
      `Branch: ${payment.branch ?? 'Downtown Central'}\n` +
      `---------------------------------\n` +
      `Taxable Value: ₹${calcs.taxableAmount.toLocaleString('en-IN')}\n` +
      `GST (18%): ₹${calcs.gstAmount.toLocaleString('en-IN')}\n` +
      `*Grand Total: ${formattedAmount}*\n` +
      `Mode: ${payment.mode.toUpperCase()}\n` +
      (payment.txnId ? `Txn ID: ${payment.txnId}\n` : '') +
      `Status: Paid & Verified\n` +
      `---------------------------------\n` +
      `Smart Library Network Accounts`;
    const waUrl = buildWhatsAppLink(payment.studentPhone, text);
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const handleEmailInvoice = () => {
    const email = payment.studentEmail || `${payment.studentName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const subject = `Tax Invoice ${calcs.invoiceNumber} - Smart Library`;
    const body = `Dear ${payment.studentName},\n\nPlease find your tax invoice details for library membership subscription:\n\nInvoice No: ${calcs.invoiceNumber}\nReceipt Ref: ${payment.receiptNumber}\nDate: ${formatDate(payment.date)}\nTotal Amount Paid: ${formattedAmount}\nBranch: ${payment.branch ?? 'Downtown Central'}\nPayment Mode: ${payment.mode.toUpperCase()}\nStatus: Paid in Full\n\nThank you for choosing Smart Library!\nAccounts Team`;
    openFinanceMailtoClient(email, subject, body);
  };

  const handleDownloadPdf = () => {
    downloadPaymentInvoicePdf(payment);
    toast.success(`Downloaded Tax Invoice PDF (${calcs.invoiceNumber})`, { id: 'admin-finance-invoice-pdf' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog p-0">
        <div className="bg-primary px-6 py-5 text-on-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  Tax Invoice
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  <Building2 className="h-3 w-3" aria-hidden="true" />
                  {payment.branch ?? 'Downtown Central'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">GST Tax Invoice</DialogTitle>
              <p className="text-xs opacity-90">
                Invoice No: <span className="font-mono font-bold">{calcs.invoiceNumber}</span>
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
          <div className="flex items-center gap-2 rounded-xl bg-info-bg border border-info px-3.5 py-2 text-xs text-info-text">
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              <strong>System Auto-Alert:</strong> Original tax invoice sent 1x via Server API upon transaction. Re-shares below use Free WhatsApp Web / Email Client (Zero API Cost).
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <User className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> Billed To (Student)
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{payment.studentName}</p>
                <p className="text-xs font-mono text-text-secondary mt-0.5">Smart ID: {payment.smartId}</p>
                <p className="text-caption text-text-secondary mt-1">Branch: {payment.branch ?? 'Downtown Central'}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <CheckCircle2 className="h-3.5 w-3.5 text-success-text" aria-hidden="true" /> Invoice Metadata
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-text-secondary">Invoice Date:</span><span className="font-medium text-text-primary">{formatDate(payment.date)}</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">GSTIN:</span><span className="font-mono text-text-primary">07AABCS1429B1Z8</span></div>
                <div className="flex justify-between"><span className="text-text-secondary">Payment Mode:</span><span className="font-bold uppercase text-primary">{payment.mode}</span></div>
                {payment.txnId && (
                  <div className="flex justify-between"><span className="text-text-secondary">Txn Ref:</span><span className="font-mono text-text-primary truncate max-w-[150px]">{payment.txnId}</span></div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-surface-highlight text-text-secondary font-semibold border-b border-border">
                <tr>
                  <th className="px-4 py-2.5 text-left">Description</th>
                  <th className="px-3 py-2.5 text-center">SAC Code</th>
                  <th className="px-3 py-2.5 text-right">Taxable Value</th>
                  <th className="px-3 py-2.5 text-right">GST (18%)</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                <tr>
                  <td className="px-4 py-3">
                    <span className="font-medium text-text-primary block">Library Study Space Access &amp; Dedicated Desk</span>
                    <span className="text-caption text-text-secondary">Monthly subscription fee</span>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-text-secondary">999293</td>
                  <td className="px-3 py-3 text-right font-medium text-text-primary">₹{calcs.taxableAmount.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">₹{calcs.gstAmount.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-right font-bold text-text-primary">{formattedAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full sm:w-64 rounded-xl border border-border bg-card p-3 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary"><span>Taxable Amount:</span><span>₹{calcs.taxableAmount.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-text-secondary"><span>CGST (9%):</span><span>₹{calcs.cgst.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-text-secondary"><span>SGST (9%):</span><span>₹{calcs.sgst.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between font-bold text-sm text-text-primary border-t border-border pt-2">
                <span>Grand Total:</span>
                <span className="text-info-text">{formattedAmount}</span>
              </div>
            </div>
          </div>
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
              onClick={handleEmailInvoice}
              className="inline-flex items-center gap-1.5 rounded-lg border border-info bg-info-bg px-3.5 py-2 text-xs font-semibold text-info-text hover:opacity-90 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Send invoice via default email client (Zero API Cost)"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email Receipt (Free Client)
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3.5 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Share or resend tax invoice via WhatsApp Web (Zero API Cost)"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share WhatsApp (Free Web)
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-focus bg-primary-subtle text-primary hover:opacity-90 px-3.5 py-2 text-xs font-semibold shadow-card motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
              title="Download Tax Invoice PDF"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-hover px-4 py-2 text-xs font-semibold shadow-card motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Print Tax Invoice (A4)
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
