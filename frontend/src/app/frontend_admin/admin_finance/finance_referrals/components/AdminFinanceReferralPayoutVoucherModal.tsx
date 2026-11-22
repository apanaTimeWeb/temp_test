'use client';

import type { ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { buildWhatsAppLink } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import { Printer,Receipt,Share2,X } from 'lucide-react';

interface AdminFinanceReferralPayoutVoucherModalProps {
  voucher: ReferralPayoutVoucher | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminFinanceReferralPayoutVoucherModal({
  voucher,
  isOpen,
  onClose,
}: AdminFinanceReferralPayoutVoucherModalProps) {
  if (!isOpen || !voucher) return null;

  const amountRupees = Math.round(voucher.amountMinor / 100);

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printWindow = window.open('', '_blank', 'width=750,height=800');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Referral Bonus Payout Voucher - ${voucher.voucherId}</title>
          <style>
            @page { size: A5 landscape; margin: 10mm; }
            body { font-family: system-ui, -apple-system, sans-serif; color: #0f172a; margin: 0; padding: 15px; font-size: 12px; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 8px; margin-bottom: 12px; }
            .logo { font-size: 16px; font-weight: 800; color: #047857; text-transform: uppercase; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; text-transform: uppercase; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
            .box-title { font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; }
            th { background: #047857; color: #fff; padding: 6px; text-align: left; }
            td { padding: 6px; border-bottom: 1px solid #e2e8f0; }
            .net-box { background: #ecfdf5; border: 2px solid #059669; border-radius: 6px; padding: 10px; text-align: right; margin-bottom: 15px; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; margin-top: 25px; }
            .signature-box { width: 180px; border-top: 1px solid #000; text-align: center; padding-top: 4px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">SMART LIBRARY NETWORK</div>
              <div style="font-size: 11px; color: #64748b;">Referral Rewards & Student Payout Department · Branch: ${voucher.branch}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge" style="background:#dcfce7; color:#15803d;">REFERRAL PAYOUT VOUCHER</span>
              <div style="font-size: 12px; font-weight: bold; margin-top: 4px;">Voucher: ${voucher.voucherId}</div>
              <div style="font-size: 10px; color: #64748b;">Date: ${voucher.disbursedAt}</div>
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="box-title">Student Beneficiary</div>
              <div style="font-size: 13px; font-weight: bold;">${voucher.studentName}</div>
              <div>Smart ID: <strong>${voucher.smartId}</strong></div>
              <div>Branch: ${voucher.branch}</div>
            </div>
            <div class="box">
              <div class="box-title">Settlement Channel</div>
              <div>Mode: <strong>${voucher.mode === 'fee_adjustment' ? 'Adjusted in Next Month Desk Fee' : 'Direct Reward Payout (' + (voucher.subChannel || 'UPI') + ')'}</strong></div>
              ${voucher.invoiceCreditNote ? `<div>Credit Note Ref: <strong>${voucher.invoiceCreditNote}</strong></div>` : ''}
              ${voucher.utrReference ? `<div>Transaction UTR: <strong>${voucher.utrReference}</strong></div>` : ''}
              <div>Authorized By: <strong>${voucher.authorizedBy}</strong></div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Disbursement Particulars</th>
                <th style="text-align: right;">Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Referral Bonus Earned Clearance (${voucher.studentName})</td>
                <td style="text-align: right; font-family: monospace; font-size: 13px; font-weight: bold;">₹${amountRupees.toLocaleString('en-IN')}.00</td>
              </tr>
              ${voucher.notes ? `<tr><td colspan="2" style="color: #64748b; font-size: 10px;"><strong>Accounting Remarks:</strong> ${voucher.notes}</td></tr>` : ''}
            </tbody>
          </table>

          <div class="net-box">
            <span style="font-size: 12px; color: #065f46; font-weight: bold;">TOTAL DISBURSED BONUS: </span>
            <span style="font-size: 18px; font-weight: 800; color: #047857;">₹${amountRupees.toLocaleString('en-IN')}.00</span>
          </div>

          <div class="footer">
            <div class="signature-box">
              <span>Student Signature / Acknowledgement</span><br/>
              <small style="color: #64748b;">(${voucher.studentName})</small>
            </div>
            <div class="signature-box">
              <span>Admin / Cashier Signature</span><br/>
              <small style="color: #64748b;">(Smart Library Accounts)</small>
            </div>
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
    const text =
      `*SMART LIBRARY - REFERRAL BONUS CLEARANCE VOUCHER*\n` +
      `---------------------------------\n` +
      `Voucher No: ${voucher.voucherId}\n` +
      `Student: ${voucher.studentName} (${voucher.smartId})\n` +
      `Branch: ${voucher.branch}\n` +
      `*Disbursed Amount: ₹${amountRupees.toLocaleString('en-IN')}*\n` +
      `Disbursement Mode: ${voucher.mode === 'fee_adjustment' ? 'Adjusted in Desk Fee (Credit Note: ' + (voucher.invoiceCreditNote || '') + ')' : 'Direct Transfer (UTR: ' + (voucher.utrReference || 'Cash') + ')'}\n` +
      `Date: ${voucher.disbursedAt}\n` +
      `Remarks: ${voucher.notes}\n` +
      `---------------------------------\n` +
      `Thank you for referring students to Smart Library!`;
    const waUrl = buildWhatsAppLink('', text);
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');
    if (popup) popup.opener = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voucher-modal-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <Receipt className="h-3.5 w-3.5" />
                  Official Payout Voucher
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-100">
                  {voucher.branch}
                </span>
              </div>
              <h2 id="voucher-modal-title" className="text-xl font-bold tracking-tight">Referral Reward Voucher</h2>
              <p className="text-xs text-emerald-100">Voucher No: <span className="font-mono font-bold text-white">{voucher.voucherId}</span></p>
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

        {/* Voucher Body Preview */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Main Card */}
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Student Beneficiary</span>
                <h3 className="text-base font-bold text-text-primary">{voucher.studentName}</h3>
                <span className="text-xs font-mono text-text-secondary">{voucher.smartId}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-text-muted uppercase tracking-wider block">Disbursed Amount</span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{amountRupees.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-text-muted block">Settlement Channel</span>
                <span className="font-semibold text-text-primary">
                  {voucher.mode === 'fee_adjustment' ? 'Adjusted in Desk Fee' : voucher.subChannel || 'Cash/UPI'}
                </span>
              </div>
              <div>
                <span className="text-text-muted block">Date & Time</span>
                <span className="font-semibold text-text-primary">{voucher.disbursedAt}</span>
              </div>
              {voucher.invoiceCreditNote && (
                <div>
                  <span className="text-text-muted block">Credit Note Ref</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {voucher.invoiceCreditNote}
                  </span>
                </div>
              )}
              {voucher.utrReference && (
                <div>
                  <span className="text-text-muted block">Transaction UTR</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {voucher.utrReference}
                  </span>
                </div>
              )}
            </div>

            {voucher.notes && (
              <div className="border-t border-border pt-2 text-xs text-text-secondary">
                <span className="font-semibold text-text-primary">Accounts Remarks: </span>
                <span>{voucher.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-4 bg-surface-elevated border-t border-border">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all"
            title="Share voucher with student on WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>WhatsApp Voucher</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              data-testid="admin-print-referral-voucher-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:opacity-90 text-primary-contrast px-4 py-2 text-xs font-semibold shadow-xs transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print Voucher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminFinanceReferralPayoutVoucherModal;
