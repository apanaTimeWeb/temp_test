'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { RotateCcw, X, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useModalScrollLock } from '@/lib/useModalScrollLock';
import type { SuperadminBillingInvoiceSample } from '@/app/frontend_superadmin/superadmin_billing/billing_invoices/types/SuperadminBillingInvoicesTypes';

interface SuperadminBillingCreditNoteModalProps {
  invoice: SuperadminBillingInvoiceSample;
  onClose: () => void;
  onCreditNoteIssued: (creditNoteId: string, amount: number, reason: string) => void;
}

export default function SuperadminBillingCreditNoteModal({
  invoice,
  onClose,
  onCreditNoteIssued,
}: SuperadminBillingCreditNoteModalProps) {
  useModalScrollLock(true);
  const [amount, setAmount] = useState<number>(invoice.amount);
  const [reason, setReason] = useState<'Cancellation' | 'Billing Error' | 'Goodwill Refund' | 'Plan Downgrade'>('Cancellation');
  const [notes, setNotes] = useState('');

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const cnId = `CN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    onCreditNoteIssued(cnId, amount, reason);
    onClose();
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="credit-note-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-[#0c0f2f] to-[#07091c] p-6 shadow-2xl text-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4 border-b border-indigo-500/20 pb-3">
          <RotateCcw className="text-amber-400" size={20} />
          <div>
            <h3 id="credit-note-modal-title" className="text-base font-bold text-white">
              Issue GST Credit Note & Process Refund
            </h3>
            <p className="text-xs text-slate-400">Linked to Invoice {invoice.id} • {invoice.tenant}</p>
          </div>
        </div>

        <form onSubmit={handleIssue} className="space-y-4 text-xs">
          <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Original Invoice Amount:</span>
              <span className="font-mono font-bold text-white text-sm">₹{invoice.amount.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">GST Treatment:</span>
              <span className="font-semibold text-emerald-400">18% GST Credit Adjustment</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Credit Note / Refund Amount (INR)</label>
            <input
              type="number"
              min={1}
              max={invoice.amount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-white font-mono font-bold focus:outline-none focus:border-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Refund / Adjustment Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as never)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-200 focus:outline-none focus:border-indigo-400"
            >
              <option value="Cancellation">Subscription Cancellation (Prorated Balance)</option>
              <option value="Billing Error">Billing Error / Duplicate Payment</option>
              <option value="Plan Downgrade">Plan Downgrade Adjustment</option>
              <option value="Goodwill Refund">Customer Retention Goodwill Credit</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Audit Notes & Explanation</label>
            <textarea
              rows={2}
              placeholder="Provide internal compliance justification..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-indigo-500/25 bg-[#060818] text-slate-200 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-indigo-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
            >
              Issue Credit Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
