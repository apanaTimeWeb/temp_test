'use client';

import { Printer, Download, Mail, MessageSquare, X, CheckCircle, AlertCircle, Building2, ShieldCheck } from 'lucide-react';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';
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
  useModalScrollLock(Boolean(isOpen && invoice));

  if (!isOpen || !invoice) return null;

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
          <title>Tax Invoice - #${invoice.id}</title>
          <style>
            @page { size: portrait; margin: 12mm 10mm; }
            * { box-sizing: border-box; }
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 9pt; line-height: 1.4; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #312e81; padding-bottom: 12px; margin-bottom: 12px; }
            .company-name { font-size: 16px; font-weight: 800; color: #312e81; }
            .muted { color: #64748b; font-size: 8.5pt; }
            .grid-2 { display: flex; justify-content: space-between; gap: 20px; margin-bottom: 16px; }
            .box { flex: 1; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
            .box-title { font-size: 8pt; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 8.5pt; margin-bottom: 14px; }
            th { background: #f1f5f9; color: #0f172a; padding: 6px 8px; border: 1px solid #cbd5e1; text-align: left; font-size: 8pt; text-transform: uppercase; }
            td { padding: 6px 8px; border: 1px solid #e2e8f0; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals-table { width: 280px; margin-left: auto; border-collapse: collapse; }
            .totals-table td { padding: 4px 8px; border: none; }
            .totals-table tr.grand-total td { font-size: 11pt; font-weight: 800; border-top: 2px solid #312e81; color: #312e81; }
            .footer { margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 8pt; color: #94a3b8; display: flex; justify-content: space-between; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 8pt; text-transform: uppercase; }
            .badge-paid { background: #dcfce7; color: #15803d; }
            .badge-due { background: #fee2e2; color: #b91c1c; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company-name">SMART LIBRARY SAAS PLATFORM</div>
              <div class="muted">Cloud Library ERP & Management Solutions</div>
              <div class="muted">GSTIN: 07AAACS9988D1Z2 · SAC: 998313 (IT SaaS Provisioning)</div>
            </div>
            <div class="text-right">
              <div style="font-size: 14px; font-weight: 800; color: #0f172a;">TAX INVOICE #${invoice.id}</div>
              <div class="muted">Date: <strong>${invoice.date}</strong></div>
              <div class="muted">Due Date: <strong>${invoice.dueDate || 'Upon Receipt'}</strong></div>
              <div style="margin-top: 4px;"><span class="badge ${isPaid ? 'badge-paid' : 'badge-due'}">${invoice.status}</span></div>
            </div>
          </div>

          <div class="grid-2">
            <div class="box">
              <div class="box-title">Billed To (Customer)</div>
              <div style="font-weight: 700; font-size: 10pt;">${invoice.tenant}</div>
              ${invoice.legalName ? `<div>${invoice.legalName}</div>` : ''}
              <div class="muted">${invoice.billingAddress || 'Central Premises'}</div>
              <div class="muted">${invoice.cityStatePin || 'India'}</div>
            </div>
            <div class="box">
              <div class="box-title">Tax & Payment Profile</div>
              <div><strong>GSTIN:</strong> ${invoice.gst || 'URP / Not Registered'}</div>
              <div><strong>Contact:</strong> ${invoice.contact || 'Account Admin'}</div>
              <div class="muted"><strong>Email:</strong> ${invoice.email || 'billing@customer.com'}</div>
              <div class="muted"><strong>Payment Mode:</strong> ${invoice.method || 'Online'} (${invoice.gateway || 'Razorpay'})</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item & Description</th>
                <th class="text-center" style="width: 14%;">SAC Code</th>
                <th class="text-center" style="width: 10%;">Qty</th>
                <th class="text-right" style="width: 18%;">Rate</th>
                <th class="text-right" style="width: 20%;">Taxable Amount</th>
              </tr>
            </thead>
            <tbody>
              ${(invoice.items || [{ description: invoice.planName || 'Platform SaaS Subscription', quantity: 1, rate: subtotal, amount: subtotal, sacCode: '998313' }]).map((item) => `
                <tr>
                  <td><strong>${item.description}</strong></td>
                  <td class="text-center">${item.sacCode || '998313'}</td>
                  <td class="text-center">${item.quantity}</td>
                  <td class="text-right">₹${item.rate.toLocaleString('en-IN')}</td>
                  <td class="text-right"><strong>₹${item.amount.toLocaleString('en-IN')}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <table class="totals-table">
            <tr>
              <td>Subtotal:</td>
              <td class="text-right">₹${subtotal.toLocaleString('en-IN')}</td>
            </tr>
            ${isIntraState ? `
              <tr>
                <td>CGST (9%):</td>
                <td class="text-right">₹${(invoice.cgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td>SGST (9%):</td>
                <td class="text-right">₹${(invoice.sgst ?? Math.round(totalTax / 2)).toLocaleString('en-IN')}</td>
              </tr>
            ` : `
              <tr>
                <td>IGST (18%):</td>
                <td class="text-right">₹${(invoice.igst ?? totalTax).toLocaleString('en-IN')}</td>
              </tr>
            `}
            <tr class="grand-total">
              <td>Total Amount:</td>
              <td class="text-right">₹${invoice.amount.toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div class="footer">
            <span>Computer Generated Invoice · Valid without Physical Signature</span>
            <span>Page 1 of 1</span>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `.trim();

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-indigo-500/30 bg-[#0c0f28] p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 ease-out"
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
