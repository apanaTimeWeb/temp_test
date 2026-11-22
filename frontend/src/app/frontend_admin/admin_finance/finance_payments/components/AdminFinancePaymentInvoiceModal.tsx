'use client';

import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { calculateInvoiceAmounts,generateInvoicePrintHtml } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinanceInvoicePrintHtml';
import { formatAdminFinanceApiAmount,formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { buildWhatsAppLink,downloadPaymentInvoicePdf } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import { Building2,CheckCircle2,Download,FileText,Mail,Printer,Share2,ShieldCheck,User,X } from 'lucide-react';
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
    const text = `*SMART LIBRARY - TAX INVOICE*\n` +
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
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Opening email client for ${email}`);
  };

  const handleDownloadPdf = () => {
    downloadPaymentInvoicePdf(payment);
    toast.success(`Downloaded Tax Invoice PDF (${calcs.invoiceNumber})`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-modal-title"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Invoice Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <FileText className="h-3.5 w-3.5" />
                  Tax Invoice
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-cyan-950/40 px-2 py-0.5 text-xs font-medium text-cyan-100">
                  <Building2 className="h-3 w-3" />
                  {payment.branch ?? 'Downtown Central'}
                </span>
              </div>
              <h2 id="invoice-modal-title" className="text-xl font-bold tracking-tight">GST Tax Invoice</h2>
              <p className="text-xs text-cyan-100">Invoice No: <span className="font-mono font-bold text-white">{calcs.invoiceNumber}</span></p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Cost Protection / System Auto-Dispatch Notice */}
          <div className="flex items-center gap-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-2 text-xs text-cyan-700 dark:text-cyan-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
            <span><strong>System Auto-Alert:</strong> Original tax invoice sent 1x via Server API upon transaction. Re-shares below use Free WhatsApp Web / Email Client (Zero API Cost).</span>
          </div>

          {/* Top metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <User className="h-3.5 w-3.5 text-primary" /> Billed To (Student)
              </div>
              <div>
                <p className="font-semibold text-text-primary text-sm">{payment.studentName}</p>
                <p className="text-xs font-mono text-text-secondary mt-0.5">Smart ID: {payment.smartId}</p>
                <p className="text-caption text-text-muted mt-1">Branch: {payment.branch ?? 'Downtown Central'}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Invoice Metadata
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-text-muted">Invoice Date:</span> <span className="font-medium text-text-primary">{formatDate(payment.date)}</span></div>
                <div className="flex justify-between"><span className="text-text-muted">GSTIN:</span> <span className="font-mono text-text-primary">07AABCS1429B1Z8</span></div>
                <div className="flex justify-between"><span className="text-text-muted">Payment Mode:</span> <span className="font-bold uppercase text-primary">{payment.mode}</span></div>
                {payment.txnId && <div className="flex justify-between"><span className="text-text-muted">Txn Ref:</span> <span className="font-mono text-text-primary truncate max-w-[150px]">{payment.txnId}</span></div>}
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-surface-elevated text-text-secondary font-semibold border-b border-border">
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
                    <span className="font-medium text-text-primary block">Library Study Space Access & Dedicated Desk</span>
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

          {/* Breakdown summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 rounded-xl border border-border bg-card p-3 space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Taxable Amount:</span>
                <span>₹{calcs.taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>CGST (9%):</span>
                <span>₹{calcs.cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>SGST (9%):</span>
                <span>₹{calcs.sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-text-primary border-t border-border pt-2">
                <span>Grand Total:</span>
                <span className="text-cyan-600 dark:text-cyan-400">{formattedAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface-elevated px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Close
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleEmailInvoice}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
              title="Send invoice via default email client (Zero API Cost)"
            >
              <Mail className="h-3.5 w-3.5" />
              Email (Free Client)
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Share or resend tax invoice via WhatsApp Web (Zero API Cost)"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share WhatsApp (Free Web)
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
              title="Download Tax Invoice PDF"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 px-4 py-2 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Tax Invoice (A4)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
