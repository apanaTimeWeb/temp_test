'use client';

import type { ReferralPayoutVoucher } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { buildReferralVoucherPrintHtml } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/adminFinanceReferralsExports';
import { buildWhatsAppLink } from '@/app/frontend_admin/admin_finance/utils/AdminFinancePdfGenerator';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { Printer, Receipt, Share2, X } from 'lucide-react';

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
    printWindow.document.open();
    printWindow.document.write(buildReferralVoucherPrintHtml(voucher, amountRupees));
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
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog p-0">
        <div className="bg-primary px-6 py-5 text-on-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                  Official Payout Voucher
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  {voucher.branch}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">Referral Reward Voucher</DialogTitle>
              <p className="text-xs opacity-90">
                Voucher No: <span className="font-mono font-bold">{voucher.voucherId}</span>
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

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="rounded-xl border border-success bg-success-bg p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[11px] text-text-secondary uppercase tracking-wider block">Student Beneficiary</span>
                <h3 className="text-base font-bold text-text-primary">{voucher.studentName}</h3>
                <span className="text-xs font-mono text-text-secondary">{voucher.smartId}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-text-secondary uppercase tracking-wider block">Disbursed Amount</span>
                <span className="text-xl font-extrabold text-success-text font-mono">₹{amountRupees.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-text-secondary block">Settlement Channel</span>
                <span className="font-semibold text-text-primary">
                  {voucher.mode === 'fee_adjustment' ? 'Adjusted in Desk Fee' : voucher.subChannel || 'Cash/UPI'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block">Date &amp; Time</span>
                <span className="font-semibold text-text-primary">{voucher.disbursedAt}</span>
              </div>
              {voucher.invoiceCreditNote && (
                <div>
                  <span className="text-text-secondary block">Credit Note Ref</span>
                  <span className="font-mono font-bold text-success-text">{voucher.invoiceCreditNote}</span>
                </div>
              )}
              {voucher.utrReference && (
                <div>
                  <span className="text-text-secondary block">Transaction UTR</span>
                  <span className="font-mono font-bold text-primary">{voucher.utrReference}</span>
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

        <div className="flex flex-wrap items-center justify-between gap-2.5 p-4 bg-surface-highlight border-t border-border">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-success bg-success-bg px-3 py-2 text-xs font-semibold text-success-text hover:opacity-90 motion-safe:transition-opacity"
            title="Share voucher with student on WhatsApp"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>WhatsApp Voucher</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary motion-safe:transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handlePrint}
              data-testid="admin-print-referral-voucher-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary px-4 py-2 text-xs font-semibold shadow-card motion-safe:transition-colors"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              <span>Print Voucher</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AdminFinanceReferralPayoutVoucherModal;
