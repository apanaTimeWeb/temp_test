'use client';

import React, { useState, useEffect } from 'react';
import { X, IndianRupee, CheckCircle2, ShieldCheck, AlertCircle, Smartphone, Building2, Receipt, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';

export interface RefundDisbursementPayload {
  paymentMethod: string;
  transactionUtr: string;
  beneficiaryAccount: string;
  receiptNumber: string;
  disbursedAt: string;
  notes: string;
}

interface AdminFinanceRefundDisburseModalProps {
  refund: AdminFinanceRefund | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisburse: (refundId: string | number, payload: RefundDisbursementPayload) => void;
}

export function AdminFinanceRefundDisburseModal({
  refund,
  isOpen,
  onClose,
  onConfirmDisburse,
}: AdminFinanceRefundDisburseModalProps) {
  const [channel, setChannel] = useState<'UPI' | 'BANK' | 'CASH'>('UPI');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [beneficiary, setBeneficiary] = useState<string>('');
  const [receiptNo, setReceiptNo] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refund) {
      setChannel('UPI');
      setUtrNumber(`41${Math.floor(1000000000 + Math.random() * 9000000000)}`);
      setReceiptNo(`RCT-REF-${new Date().getFullYear()}-${refund.id}`);
      setBeneficiary(`${refund.studentName.toLowerCase().replace(/\s+/g, '')}@okaxis`);
      setNotes('Security deposit refund after library seat & key clearance');
      setError(null);
    }
  }, [refund]);

  if (!isOpen || !refund) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (channel !== 'CASH' && !utrNumber.trim()) {
      setError('Please provide the Bank / UPI Transaction UTR Number.');
      return;
    }

    const payload: RefundDisbursementPayload = {
      paymentMethod: channel === 'UPI' ? 'UPI Transfer' : channel === 'BANK' ? 'IMPS / NEFT Bank Transfer' : 'Cash Handover at Counter',
      transactionUtr: channel === 'CASH' ? 'CASH-COUNTER' : utrNumber.trim(),
      beneficiaryAccount: beneficiary.trim(),
      receiptNumber: receiptNo.trim(),
      disbursedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      notes: notes.trim(),
    };

    onConfirmDisburse(refund.id, payload);
    toast.success(
      `₹${refund.netRefund.toLocaleString('en-IN')} disbursed to ${refund.studentName}. UTR: ${payload.transactionUtr}. Receipt ${receiptNo} issued.`
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="disburse-refund-title"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-xs">
                  <Receipt className="h-3.5 w-3.5" />
                  Refund Payout & UTR Entry
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-950/40 px-2 py-0.5 text-xs font-medium text-emerald-100">
                  {refund.branchName ?? 'Downtown Central'}
                </span>
              </div>
              <h2 id="disburse-refund-title" className="text-xl font-bold tracking-tight">Record Refund Transfer</h2>
              <p className="text-xs text-emerald-100">
                Student: <span className="font-semibold text-white">{refund.studentName}</span> ({refund.smartId})
              </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Net Payable Highlight Card */}
          <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Net Refund Payable</span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{refund.netRefund.toLocaleString('en-IN')}.00
              </span>
            </div>
            <div className="text-right text-xs text-text-secondary">
              <div>Held: ₹{refund.depositHeld.toLocaleString('en-IN')}</div>
              {refund.deductionAmount > 0 && <div className="text-rose-500">Deduction: -₹{refund.deductionAmount.toLocaleString('en-IN')}</div>}
            </div>
          </div>

          {/* Payment Method / Channel Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Payment Transfer Method (भुगतान माध्यम) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('UPI')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'UPI'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Smartphone className="h-4 w-4 mb-1" />
                <span>UPI Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('BANK')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'BANK'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 ring-2 ring-cyan-500/30'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1" />
                <span>Bank IMPS / NEFT</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('CASH')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  channel === 'CASH'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-2 ring-amber-500/30'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <IndianRupee className="h-4 w-4 mb-1" />
                <span>Cash Counter</span>
              </button>
            </div>
          </div>

          {/* Transaction UTR / Ref Number (Mandatory for UPI/Bank) */}
          {channel !== 'CASH' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="refund-utr" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Transaction UTR / Bank Reference Number *
                </label>
                <span className="text-[11px] text-text-muted font-mono">12-Digit Banking Ref</span>
              </div>
              <input
                id="refund-utr"
                type="text"
                required
                value={utrNumber}
                onChange={(e) => {
                  setUtrNumber(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 412398572104 or CMS0912481"
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Beneficiary Account or UPI ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="refund-beneficiary" className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                {channel === 'UPI' ? 'Beneficiary UPI ID' : channel === 'BANK' ? 'Account Number / IFSC' : 'Handed Over To'}
              </label>
              <input
                id="refund-beneficiary"
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder={channel === 'UPI' ? 'student@okaxis' : 'HDFC0001 / A/C 9812401'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="refund-receipt-no" className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                Official Receipt Number
              </label>
              <input
                id="refund-receipt-no"
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary font-bold"
              />
            </div>
          </div>

          {/* Accounts Notes */}
          <div className="space-y-1.5">
            <label htmlFor="refund-notes" className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Accounting Remarks
            </label>
            <input
              id="refund-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deposit refunded upon key return and desk vacancy"
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-confirm-refund-transfer-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm Transfer & Generate Receipt</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AdminFinanceRefundDisburseModal;
