'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, Download, Mail, MessageSquare, X, CheckCircle, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { generateSuperadminInvoicePrintHtml } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicePrintHtml';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminBillingInvoiceDetailModalProps {
  invoice: SuperadminBillingInvoiceSample | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail?: (inv: SuperadminBillingInvoiceSample) => void;
  onSendWhatsApp?: (inv: SuperadminBillingInvoiceSample) => void;
}

export default function SuperadminBillingInvoiceDetailModal({
  invoice,
  isOpen,
  onClose,
  onSendEmail,
  onSendWhatsApp,
}: SuperadminBillingInvoiceDetailModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(isOpen && invoice && mounted));

  if (!isOpen || !invoice || !mounted) return null;

  const isPaid = invoice.status === 'Paid';
  const subtotal = invoice.subtotal ?? (invoice.amount ? Math.round(invoice.amount / 1.18) : 2999);
  const totalTax = invoice.amount ? invoice.amount - subtotal : Math.round(subtotal * 0.18);
  const isIntraState = Boolean(invoice.cgst && invoice.sgst);

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = generateSuperadminInvoicePrintHtml(invoice);
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handleDownload = () => {
    SuperadminBillingDownloadSampleInvoicePdf(invoice);
  };

  const handleDefaultEmail = () => {
    if (onSendEmail) {
      onSendEmail(invoice);
      return;
    }
    const email = invoice.email || 'billing@customer.com';
    const subject = `Smart Library SaaS Tax Invoice #${invoice.id} - ${invoice.tenant}`;
    const body = `Dear ${invoice.tenant},\n\nPlease find your official SaaS subscription tax invoice #${invoice.id} for ₹${invoice.amount.toLocaleString('en-IN')}.\nDue Date: ${invoice.dueDate || 'Upon Receipt'}\nStatus: ${invoice.status}\n\nThank you for partnering with Smart Library!\nSaaS Finance & Treasury Team`;
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleDefaultWhatsApp = () => {
    if (onSendWhatsApp) {
      onSendWhatsApp(invoice);
      return;
    }
    const raw = invoice.phone || '9876543210';
    let digits = raw.replace(/\D/g, '');
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const msg = `Hello ${invoice.tenant}, your Smart Library tax invoice ${invoice.id} for ₹${invoice.amount.toLocaleString('en-IN')} (Due: ${invoice.dueDate || 'Upon Receipt'}) is ready.`;
    const popup = window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-5 sm:p-6 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">Tax Invoice & Billing Record</h2>
              <p className="text-xs text-slate-400 font-mono">Invoice #{invoice.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cost Protection / Auto-Dispatch Notice */}
        <div className="flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2 text-xs text-indigo-300">
          <ShieldCheck className="h-4 w-4 shrink-0 text-indigo-400" />
          <span><strong>System Auto-Dispatch:</strong> 1x SaaS subscription tax invoice sent via server API upon billing cycle. Re-shares below use Free WhatsApp Web / Email Client (Zero API Cost).</span>
        </div>

        {/* Invoice Summary Card */}
        <div className="rounded-xl border border-indigo-500/20 bg-slate-900/60 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-3 border-b border-border/40 pb-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Billed To (Tenant)</span>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">{invoice.tenant}</h3>
              {invoice.legalName && <p className="text-xs text-slate-300 font-medium">{invoice.legalName}</p>}
              <p className="text-xs text-slate-400">{invoice.billingAddress || 'Central Premises'}</p>
              <p className="text-xs text-slate-400">{invoice.cityStatePin || 'India'}</p>
            </div>
            <div className="sm:text-right space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Payment Status</span>
              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    isPaid
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : invoice.status === 'Overdue'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {isPaid ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  <span>{invoice.status}</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">Issue Date: <strong className="text-slate-200">{invoice.date}</strong></p>
              <p className="text-xs text-slate-400">Due Date: <strong className="text-slate-200">{invoice.dueDate || 'Upon Receipt'}</strong></p>
            </div>
          </div>

          {/* Tax & Gateway Profile */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-border/40">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN Number</span>
              <span className="text-slate-200 font-mono font-medium">{invoice.gst || 'Unregistered'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-border/40">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Gateway</span>
              <span className="text-slate-200 font-medium">{invoice.gateway || 'Razorpay'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-border/40">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
              <span className="text-slate-200 font-medium">{invoice.method || 'Online'}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/40 border border-border/40">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Billing Cycle</span>
              <span className="text-slate-200 font-medium">{invoice.billingCycle || 'Monthly'}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-[11px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="p-2.5">Item & Description</th>
                  <th className="p-2.5 text-center">SAC Code</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Rate</th>
                  <th className="p-2.5 text-right">Taxable Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-slate-200">
                {(invoice.items || [{ description: invoice.planName || 'Platform SaaS Subscription', quantity: 1, rate: subtotal, amount: subtotal, sacCode: '998313' }]).map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-medium">{item.description}</td>
                    <td className="p-2.5 text-center font-mono text-[11px] text-slate-400">{item.sacCode || '998313'}</td>
                    <td className="p-2.5 text-center">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="p-2.5 text-right font-mono font-bold">₹{item.amount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Total */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={12} /> Computer Generated Invoice · No signature required.
              </p>
              <p>Place of Supply: Inter-State / Intra-State SaaS Provisioning.</p>
              {invoice.creditNoteId && <p className="text-amber-300 font-medium">Credit Note Ref: {invoice.creditNoteId}</p>}
            </div>

            <div className="space-y-1.5 min-w-[200px] text-right text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {isIntraState ? (
                <>
                  <div className="flex justify-between text-slate-400">
                    <span>CGST (9%):</span>
                    <span className="font-mono text-slate-200">₹{(invoice.cgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>SGST (9%):</span>
                    <span className="font-mono text-slate-200">₹{(invoice.sgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-400">
                  <span>IGST (18%):</span>
                  <span className="font-mono text-slate-200">₹{totalTax.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-border/80 text-sm font-bold text-slate-100">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400">₹{invoice.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-indigo-500/20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDefaultEmail}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
              title="Send invoice via default email client (Zero API Cost)"
            >
              <Mail size={13} />
              <span>Email Customer (Free Client)</span>
            </button>
            <button
              type="button"
              onClick={handleDefaultWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
              title="Share or resend invoice via WhatsApp Web (Zero API Cost)"
            >
              <MessageSquare size={13} />
              <span>WhatsApp (Free Web)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer transition-all"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
