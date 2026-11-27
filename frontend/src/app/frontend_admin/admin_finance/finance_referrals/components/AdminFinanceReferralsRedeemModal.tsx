'use client';

import type { AdminFinanceDemoReferrer } from '@/app/frontend_admin/admin_finance/finance_referrals/types/AdminFinanceReferralsTypes';
import { formatAdminFinanceCurrency } from '@/app/frontend_admin/admin_finance/finance_referrals/utils/AdminFinanceReferralsFormat';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, CheckCircle2, CreditCard, Gift, IndianRupee, Receipt, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface AdminFinanceReferralsRedeemModalProps {
  referrer: AdminFinanceDemoReferrer | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRedeem: (
    referrerId: number,
    amountMinor: number,
    mode: 'fee_adjustment' | 'cash_upi',
    notes: string,
    voucherMeta?: {
      subChannel?: string;
      utrReference?: string;
      invoiceCreditNote?: string;
    },
  ) => void;
}

export function AdminFinanceReferralsRedeemModal({
  referrer,
  isOpen,
  onClose,
  onConfirmRedeem,
}: AdminFinanceReferralsRedeemModalProps) {
  const [mode, setMode] = useState<'fee_adjustment' | 'cash_upi'>('fee_adjustment');
  const [subChannel, setSubChannel] = useState<'UPI' | 'CASH'>('UPI');
  const [amountRupees, setAmountRupees] = useState<number>(0);
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [creditNoteNo, setCreditNoteNo] = useState<string>('');
  const [studentUpi, setStudentUpi] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referrer) {
      const maxRupees = Math.round(referrer.balance / 100);
      setAmountRupees(maxRupees);
      setCreditNoteNo(`CR-REF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setUtrNumber(`41${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setStudentUpi(`${referrer.name.toLowerCase().replace(/\s+/g, '')}@okaxis`);
      setNotes(
        mode === 'fee_adjustment'
          ? 'Credit note generated to adjust against upcoming desk subscription invoice'
          : 'Referral reward payout cleared via direct transfer',
      );
      setError(null);
    }
  }, [referrer, mode]);

  if (!isOpen || !referrer) return null;

  const maxBalanceRupees = Math.round(referrer.balance / 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountRupees <= 0) {
      setError('Please enter a valid redemption amount greater than ₹0.');
      return;
    }
    if (amountRupees > maxBalanceRupees) {
      setError(`Amount cannot exceed the available balance of ₹${maxBalanceRupees}.`);
      return;
    }
    if (mode === 'cash_upi' && subChannel === 'UPI' && !utrNumber.trim()) {
      setError('Please provide the UPI Transaction UTR / Reference number for accounting.');
      return;
    }

    const amountMinor = amountRupees * 100;
    const voucherMeta = {
      subChannel: mode === 'fee_adjustment' ? 'Fee Credit Note' : subChannel === 'UPI' ? 'UPI Transfer' : 'Counter Cash Handover',
      utrReference: mode === 'cash_upi' && subChannel === 'UPI' ? utrNumber.trim() : undefined,
      invoiceCreditNote: mode === 'fee_adjustment' ? creditNoteNo.trim() : undefined,
    };

    onConfirmRedeem(referrer.id, amountMinor, mode, notes, voucherMeta);
    toast.success(
      `Disbursed ₹${amountRupees.toLocaleString('en-IN')} referral bonus for ${referrer.name} (${
        mode === 'fee_adjustment' ? `Credit Note ${creditNoteNo}` : `${subChannel} Payout Voucher`
      })`,
      { id: 'admin-finance-referrals-redeem' },
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }}>
      <DialogContent className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-overlay shadow-dialog p-0">
        <div className="bg-primary px-6 py-5 text-on-primary">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-card px-2 py-0.5 text-xs font-semibold text-primary">
                  <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                  Referral Reward Clearance &amp; Voucher
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  {referrer.branch ?? 'Downtown Central'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">Disburse Referral Bonus</DialogTitle>
              <p className="text-xs opacity-90">
                Student: <span className="font-semibold">{referrer.name}</span> ({referrer.smartId})
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-surface-highlight p-3.5 text-center">
            <div>
              <span className="text-[11px] text-text-secondary block">Total Earned</span>
              <span className="text-sm font-bold text-text-primary mt-0.5 block font-mono">{formatAdminFinanceCurrency(referrer.bonusEarned)}</span>
            </div>
            <div className="border-x border-border">
              <span className="text-[11px] text-text-secondary block">Already Redeemed</span>
              <span className="text-sm font-bold text-text-secondary mt-0.5 block font-mono">{formatAdminFinanceCurrency(referrer.redeemed)}</span>
            </div>
            <div>
              <span className="text-[11px] text-success-text font-semibold block">Available Balance</span>
              <span className="text-base font-extrabold text-success-text mt-0.5 block font-mono">{formatAdminFinanceCurrency(referrer.balance)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Disbursement Channel (समाधान का तरीका) *
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMode('fee_adjustment');
                  setNotes('Credit note generated to adjust against upcoming desk subscription invoice');
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left motion-safe:transition-colors ${
                  mode === 'fee_adjustment' ? 'border-success bg-success-bg ring-2 ring-primary' : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
                  <CreditCard className="h-4 w-4 text-success-text" aria-hidden="true" />
                  <span>Adjust in Next Fee (फीस में माइनस)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Generates an Invoice Credit Note deducted from student&apos;s next desk subscription
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('cash_upi');
                  setNotes('Paid via Cash / UPI Counter Transfer');
                }}
                className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left motion-safe:transition-colors ${
                  mode === 'cash_upi' ? 'border-border-focus bg-primary-subtle ring-2 ring-primary' : 'border-border bg-card hover:bg-surface-hover'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-text-primary">
                  <IndianRupee className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>Disburse Cash / UPI (पेआउट वाउचर)</span>
                </div>
                <p className="text-[11px] text-text-secondary leading-tight">
                  Disburse reward immediately and issue an official printable Payout Voucher
                </p>
              </button>
            </div>
          </div>

          {mode === 'fee_adjustment' ? (
            <div className="rounded-xl border border-success bg-success-bg p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-success-text flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" /> Generated Invoice Credit Note:
                </span>
                <span className="font-mono text-xs font-bold text-success-text">{creditNoteNo}</span>
              </div>
              <p className="text-[11px] text-text-secondary">
                This ₹{amountRupees} credit will be automatically applied to {referrer.name}&apos;s ledger and subtracted from their next monthly fee receipt.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border-focus bg-primary-subtle p-3.5 space-y-3">
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-text-primary">
                  <input type="radio" name="referralSubChannel" value="UPI" checked={subChannel === 'UPI'} onChange={() => setSubChannel('UPI')} />
                  <span>UPI Instant Transfer</span>
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-text-primary">
                  <input type="radio" name="referralSubChannel" value="CASH" checked={subChannel === 'CASH'} onChange={() => setSubChannel('CASH')} />
                  <span>Cash Handover at Counter</span>
                </label>
              </div>
              {subChannel === 'UPI' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label htmlFor="ref-utr-input" className="text-[11px] font-semibold text-text-secondary block mb-1">Transaction UTR / Ref No *</label>
                    <input id="ref-utr-input" maxLength={100} type="text" required value={utrNumber} onChange={(e) => setUtrNumber(e.target.value)} placeholder="e.g. 412398512401" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label htmlFor="ref-upi-id-input" className="text-[11px] font-semibold text-text-secondary block mb-1">Student UPI ID / Phone</label>
                    <input id="ref-upi-id-input" maxLength={100} type="text" value={studentUpi} onChange={(e) => setStudentUpi(e.target.value)} placeholder="e.g. rahul@okaxis" className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="redeem-amount" className="text-xs font-bold uppercase tracking-wider text-text-secondary">Redemption Amount (₹ INR)</label>
              <button type="button" onClick={() => setAmountRupees(maxBalanceRupees)} className="text-[11px] text-primary hover:underline font-medium">
                Max Available (₹{maxBalanceRupees})
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-sm">₹</span>
              <input id="redeem-amount" type="number" min="1" max={maxBalanceRupees} value={amountRupees || ''} onChange={(e) => { setAmountRupees(Number(e.target.value)); setError(null); }} className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary font-mono font-semibold" placeholder="Enter amount..." required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="redeem-notes" className="text-xs font-bold uppercase tracking-wider text-text-secondary">Accounts Reference / Notes</label>
            <input maxLength={250} id="redeem-notes" type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Adjusted in May 2026 invoice, or UPI UTR: 8942019" />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-bg border border-danger p-2.5 text-xs text-danger-text">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button type="button" onClick={onClose} className="rounded-lg border border-border bg-surface-highlight px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors">
              Cancel
            </button>
            <button type="submit" data-testid="admin-confirm-referral-disbursement-btn" aria-label="Confirm Disbursement & Generate Voucher" className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary px-4 py-2 text-xs font-semibold shadow-card motion-safe:transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Confirm Disbursement &amp; Generate Voucher</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminFinanceReferralsRedeemModal;
