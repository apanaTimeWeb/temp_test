'use client';

import type { AdminFinanceRefund } from '@/app/frontend_admin/admin_finance/finance_refunds/types/AdminFinanceRefundsComponentTypes';
import { formatAdminFinanceRefundsInr } from '@/app/frontend_admin/admin_finance/finance_refunds/utils/formatAdminFinanceRefundsInr';
import Dialog from '@/app/frontend_admin/components/ui/dialog/Dialog';
import DialogContent from '@/app/frontend_admin/components/ui/dialog/DialogContent';
import DialogTitle from '@/app/frontend_admin/components/ui/dialog/DialogTitle';
import { AlertCircle, Building2, CheckCircle2, IndianRupee, Receipt, Smartphone, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
      `₹${refund.netRefund.toLocaleString('en-IN')} disbursed to ${refund.studentName}. UTR: ${payload.transactionUtr}. Receipt ${receiptNo} issued.`,
      { id: 'refund-disburse-success' }
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
                  <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                  Refund Payout & UTR Entry
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-surface-highlight px-2 py-0.5 text-xs font-medium text-text-primary">
                  {refund.branchName ?? 'Downtown Central'}
                </span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-on-primary">Record Refund Transfer</DialogTitle>
              <p className="text-xs opacity-90">
                Student: <span className="font-semibold">{refund.studentName}</span> ({refund.smartId})
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between rounded-xl border border-success bg-success-bg p-4">
            <div>
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Net Refund Payable</span>
              <span className="text-2xl font-extrabold text-success-text font-mono">
                {formatAdminFinanceRefundsInr(refund.netRefund, 2)}
              </span>
            </div>
            <div className="text-right text-xs text-text-secondary">
              <div>Held: {formatAdminFinanceRefundsInr(refund.depositHeld)}</div>
              {refund.deductionAmount > 0 && (
                <div className="text-danger-text">Deduction: -{formatAdminFinanceRefundsInr(refund.deductionAmount)}</div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Payment Transfer Method (भुगतान माध्यम) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setChannel('UPI')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold motion-safe:transition-colors ${
                  channel === 'UPI'
                    ? 'border-success bg-success-bg text-success-text ring-2 ring-success'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Smartphone className="h-4 w-4 mb-1" aria-hidden="true" />
                <span>UPI Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('BANK')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold motion-safe:transition-colors ${
                  channel === 'BANK'
                    ? 'border-info bg-info-bg text-info-text ring-2 ring-info'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <Building2 className="h-4 w-4 mb-1" aria-hidden="true" />
                <span>Bank IMPS / NEFT</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel('CASH')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold motion-safe:transition-colors ${
                  channel === 'CASH'
                    ? 'border-warning bg-warning-bg text-warning-text ring-2 ring-warning'
                    : 'border-border bg-card text-text-secondary hover:bg-surface-hover'
                }`}
              >
                <IndianRupee className="h-4 w-4 mb-1" aria-hidden="true" />
                <span>Cash Counter</span>
              </button>
            </div>
          </div>

          {channel !== 'CASH' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="refund-utr" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Transaction UTR / Bank Reference Number *
                </label>
                <span className="text-[11px] text-text-secondary font-mono">12-Digit Banking Ref</span>
              </div>
              <input
                maxLength={30}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="refund-beneficiary" className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
                {channel === 'UPI' ? 'Beneficiary UPI ID' : channel === 'BANK' ? 'Account Number / IFSC' : 'Handed Over To'}
              </label>
              <input
                maxLength={30}
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
                maxLength={30}
                id="refund-receipt-no"
                type="text"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary font-mono focus:outline-none focus:ring-2 focus:ring-primary font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="refund-notes" className="text-xs font-bold uppercase tracking-wider text-text-secondary block">
              Accounting Remarks
            </label>
            <input
              maxLength={250}
              id="refund-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Deposit refunded upon key return and desk vacancy"
              className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-input text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-danger-bg border border-danger p-2.5 text-xs text-danger-text">
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover motion-safe:transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              data-testid="admin-confirm-refund-transfer-btn"
              className="inline-flex items-center gap-1.5 rounded-lg bg-success text-on-primary hover:opacity-90 px-4 py-2 text-xs font-semibold shadow-card motion-safe:transition-opacity focus:outline-none focus:ring-2 focus:ring-success cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Confirm Transfer & Generate Receipt</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default AdminFinanceRefundDisburseModal;
