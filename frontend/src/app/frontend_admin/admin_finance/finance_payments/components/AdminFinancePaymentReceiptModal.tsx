'use client';

import React from 'react';
import { X, Printer, Share2, CheckCircle2, Building2, User, CreditCard, Calendar, Hash, FileCheck, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminFinancePayment } from '@/app/frontend_admin/admin_finance/finance_payments/types/AdminFinancePaymentsComponentTypes';
import { formatAdminFinanceApiAmount, formatDate } from '@/app/frontend_admin/admin_finance/finance_payments/utils/AdminFinancePaymentsFormat';
import { downloadPaymentReceiptPdf, buildWhatsAppLink } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';

interface AdminFinancePaymentReceiptModalProps {
  payment: AdminFinancePayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminFinancePaymentReceiptModal({ payment, isOpen, onClose }: AdminFinancePaymentReceiptModalProps) {
  if (!isOpen || !payment) return null;

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=420,height=600');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = `
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
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleShareWhatsApp = () => {
    const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');
    const text = `*SMART LIBRARY - PAYMENT RECEIPT*\n` +
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
    const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');
    const subject = `Fee Payment Receipt ${payment.receiptNumber} - Smart Library`;
    const body = `Dear ${payment.studentName},\n\nThank you for your fee payment to Smart Library. Below is your official receipt summary:\n\nReceipt No: ${payment.receiptNumber}\nDate: ${formatDate(payment.date)}\nTotal Paid: ${formattedAmount}\nMode: ${payment.mode.toUpperCase()}\nSmart ID: ${payment.smartId}\nBranch: ${payment.branch ?? 'Main Branch'}\nStatus: Paid & Verified\n\nThank you for choosing Smart Library!`;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast.success(`Opening email client for ${email}`);
  };

  const handleDownloadPdf = () => {
    downloadPaymentReceiptPdf(payment);
    toast.success(`Downloaded Payment Receipt PDF (${payment.receiptNumber})`);
  };

  const formattedAmount = formatAdminFinanceApiAmount(payment.amount, payment.currencyCode ?? 'INR', payment.amountUnit ?? 'major');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Receipt Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <FileCheck className="h-3.5 w-3.5" />
                  Official Receipt
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-100">
                  <Building2 className="h-3 w-3" />
                  {payment.branch ?? 'Downtown Central'}
                </span>
              </div>
              <h2 id="receipt-modal-title" className="text-xl font-bold tracking-tight">Smart Library Receipt</h2>
              <p className="text-xs text-emerald-100">Receipt Ref: <span className="font-mono font-bold text-white">{payment.receiptNumber}</span></p>
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

        {/* Receipt Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Status Badge */}
          <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Payment Confirmed & Verified</p>
                <p className="text-caption text-text-secondary">{formatDate(payment.date)}</p>
              </div>
            </div>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">{formattedAmount}</span>
          </div>

          {/* Student Info Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Student & Member Details</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-muted block flex items-center gap-1">
                  <User className="h-3 w-3" /> Student Name
                </span>
                <span className="font-semibold text-text-primary mt-0.5 block">{payment.studentName}</span>
              </div>
              <div>
                <span className="text-text-muted block flex items-center gap-1">
                  <Hash className="h-3 w-3" /> Smart ID
                </span>
                <span className="font-mono font-medium text-text-primary mt-0.5 block">{payment.smartId}</span>
              </div>
            </div>
          </div>

          {/* Transaction Info Card */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-secondary">Transaction Breakdown</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-text-muted block flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> Payment Mode
                </span>
                <span className="inline-flex mt-1 items-center gap-1 rounded-md bg-surface-elevated px-2 py-0.5 text-xs font-bold uppercase text-primary">
                  {payment.mode}
                </span>
              </div>
              <div>
                <span className="text-text-muted block flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Txn Reference
                </span>
                <span className="font-mono text-text-primary mt-1 block truncate" title={payment.txnId ?? 'N/A'}>
                  {payment.txnId ?? 'Cash/POS Counter'}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Late Fee Component</span>
                <span className="font-medium text-text-secondary mt-0.5 block">
                  {payment.lateFee && payment.lateFee > 0 ? `₹${payment.lateFee}` : '₹0 (None)'}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Authorized Collector</span>
                <span className="font-medium text-text-secondary mt-0.5 block">{payment.receivedBy}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-caption text-text-muted">
            This is an electronically generated receipt verified by Smart Library Treasury. No signature required.
          </p>
        </div>

        {/* Modal Action Buttons */}
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
              onClick={handleEmailReceipt}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
              title="Email Receipt to Student"
            >
              <Mail className="h-3.5 w-3.5" />
              Email Receipt
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Share Receipt on WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5" />
              Share WhatsApp
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Download Receipt PDF"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-contrast shadow-sm hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Receipt (80mm)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
