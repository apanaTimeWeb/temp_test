'use client';

import { Printer, Download, Mail, MessageSquare, X, CheckCircle, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
import { SuperadminBillingDownloadSampleInvoicePdf } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/utils/SuperadminBillingInvoicesSamplePdf';

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
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    try {
      SuperadminBillingDownloadSampleInvoicePdf(invoice);
    } catch {
      // PDF preview fallback
    }
  };

  const isPaid = invoice.status === 'Paid';
  const subtotal = invoice.subtotal ?? Math.round(invoice.amount / 1.18);
  const totalTax = invoice.amount - subtotal;
  const isIntraState = Boolean(invoice.cgst && invoice.sgst);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 sm:p-7 shadow-2xl space-y-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Tax Invoice</span>
              <span className="font-mono text-indigo-400">#{invoice.id}</span>
            </h2>
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
              isPaid ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-400' : 'border-amber-500/30 bg-amber-500/15 text-amber-400'
            }`}>
              {isPaid ? <CheckCircle size={11} /> : <AlertCircle size={11} />} {invoice.status}
            </span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="rounded-xl border border-border/80 bg-slate-900/90 p-5 space-y-5 text-xs">
          {/* Header & Seller */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div>
              <div className="flex items-center gap-2 font-black text-base text-slate-100">
                <Building2 className="text-indigo-400 h-5 w-5" />
                <span>SMART LIBRARY SAAS PLATFORM</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">Cloud Library ERP & Management Solutions</p>
              <p className="text-slate-400 text-[11px]">GSTIN: 07AAACS9988D1Z2 · SAC: 998313 (IT SaaS)</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Invoice Details</span>
              <p className="text-slate-100 font-bold">Date: {invoice.date}</p>
              <p className="text-slate-300">Due Date: {invoice.dueDate || 'Upon Receipt'}</p>
              <p className="text-indigo-400 font-semibold">Payment: {invoice.method} ({invoice.gateway || 'Razorpay'})</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Billed To (Customer):</span>
              <h3 className="font-bold text-slate-100 text-sm mt-0.5">{invoice.tenant}</h3>
              {invoice.legalName && <p className="text-slate-300">{invoice.legalName}</p>}
              <p className="text-slate-400">{invoice.billingAddress || 'Central Premises'}</p>
              <p className="text-slate-400">{invoice.cityStatePin || 'India'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Customer Tax Profile:</span>
              <p className="text-slate-200 font-mono mt-0.5">GSTIN: {invoice.gst}</p>
              <p className="text-slate-300">Contact: {invoice.contact || 'Account Admin'}</p>
              <p className="text-slate-400">Email: {invoice.email || 'billing@customer.com'}</p>
              <p className="text-slate-400">Phone: {invoice.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto rounded-lg border border-border/60">
            <table className="w-full text-left">
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
              {invoice.creditNoteId && <p className="text-amber-300">Credit Note Ref: {invoice.creditNoteId}</p>}
            </div>

            <div className="space-y-1.5 min-w-[200px] text-right">
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
            {onSendEmail && (
              <button
                type="button"
                onClick={() => onSendEmail(invoice)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 text-xs font-semibold cursor-pointer"
              >
                <Mail size={13} />
                <span>Email Customer</span>
              </button>
            )}
            {onSendWhatsApp && (
              <button
                type="button"
                onClick={() => onSendWhatsApp(invoice)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-semibold cursor-pointer"
              >
                <MessageSquare size={13} />
                <span>WhatsApp</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold cursor-pointer"
            >
              <Printer size={13} />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold shadow-md active:scale-95 cursor-pointer"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
