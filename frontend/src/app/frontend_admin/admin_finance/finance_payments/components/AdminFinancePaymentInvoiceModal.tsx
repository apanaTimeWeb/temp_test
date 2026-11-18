'use client';

import React from 'react';
import { X, Printer, Share2, Building2, User, FileText, Download, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { downloadPaymentInvoicePdf, buildWhatsAppLink } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';

interface AdminFinancePaymentInvoiceModalProps {
  payment: AdminFinancePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminFinancePaymentInvoiceModal({ payment, isOpen, onClose }: AdminFinancePaymentInvoiceModalProps) {
  if (!isOpen || !payment) return null;

  const invoiceNumber = `INV-${payment.receiptNumber.replace(/^REC-/, '')}`;
  const totalAmount = payment.amount;
  const taxableAmount = Math.round(totalAmount / 1.18);
  const gstAmount = totalAmount - taxableAmount;
  const cgst = Math.round(gstAmount / 2);
  const sgst = gstAmount - cgst;

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${invoiceNumber}</title>
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
              <div style="font-size: 16px; font-weight: bold; margin-top: 6px;">${invoiceNumber}</div>
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
                <td style="text-align: right;">₹${taxableAmount.toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${cgst.toLocaleString('en-IN')}</td>
                <td style="text-align: right;">₹${sgst.toLocaleString('en-IN')}</td>
                <td style="text-align: right; font-weight: bold;">₹${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Taxable Subtotal:</td>
              <td style="text-align: right; font-weight: bold;">₹${taxableAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>CGST (9%):</td>
              <td style="text-align: right;">₹${cgst.toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>SGST (9%):</td>
              <td style="text-align: right;">₹${sgst.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="grand-total">
              <td>Total Amount:</td>
              <td style="text-align: right;">₹${totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div class="footer">
            <p>Smart Library Services Pvt. Ltd. · System Generated Tax Invoice · Thank you for studying with us!</p>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');
    const text = `*SMART LIBRARY - TAX INVOICE*\n` +
      `---------------------------------\n` +
      `Invoice No: ${invoiceNumber}\n` +
      `Receipt Ref: ${payment.receiptNumber}\n` +
      `Date: ${formatDate(payment.date)}\n` +
      `Student Name: ${payment.studentName}\n` +
      `Smart ID: ${payment.smartId}\n` +
      `Branch: ${payment.branch ?? 'Downtown Central'}\n` +
      `---------------------------------\n` +
      `Taxable Value: ₹${taxableAmount.toLocaleString('en-IN')}\n` +
      `GST (18%): ₹${gstAmount.toLocaleString('en-IN')}\n` +
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
    const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');
    const subject = `Tax Invoice ${invoiceNumber} - Smart Library`;
    const body = `Dear ${payment.studentName},\n\nPlease find your tax invoice details for library membership subscription:\n\nInvoice No: ${invoiceNumber}\nReceipt Ref: ${payment.receiptNumber}\nDate: ${formatDate(payment.date)}\nTotal Amount Paid: ${formattedAmount}\nBranch: ${payment.branch ?? 'Downtown Central'}\nPayment Mode: ${payment.mode.toUpperCase()}\nStatus: Paid in Full\n\nThank you for choosing Smart Library!\nAccounts Team`;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Opening email client for ${email}`);
  };

  const handleDownloadPdf = () => {
    downloadPaymentInvoicePdf(payment);
    toast.success(`Downloaded Tax Invoice PDF (${invoiceNumber})`);
  };

  const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');

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
              <p className="text-xs text-cyan-100">Invoice No: <span className="font-mono font-bold text-white">{invoiceNumber}</span></p>
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
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
                  <td className="px-3 py-3 text-right font-medium text-text-primary">₹{taxableAmount.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-3 text-right text-text-secondary">₹{gstAmount.toLocaleString('en-IN')}</td>
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
                <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>CGST (9%):</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>SGST (9%):</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
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
              title="Email Tax Invoice to Student"
            >
              <Mail className="h-3.5 w-3.5" />
              Email Receipt
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Share Invoice on WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share WhatsApp
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
