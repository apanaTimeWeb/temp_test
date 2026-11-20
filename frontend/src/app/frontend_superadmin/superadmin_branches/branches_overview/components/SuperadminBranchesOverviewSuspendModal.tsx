'use client';

import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import type { SuperadminBranchRecord } from '../types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewSuspendModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
  onConfirm: (branchId: string, reason: string) => void;
}

export default function SuperadminBranchesOverviewSuspendModal({
  branch,
  onClose,
  onConfirm,
}: SuperadminBranchesOverviewSuspendModalProps) {
  const [reason, setReason] = useState('Compliance review pending');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for suspension.');
      return;
    }
    onConfirm(branch.id, reason.trim());
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="suspend-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0f172a] text-white shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 id="suspend-modal-title" className="text-base font-bold text-white">
                Temporarily Suspend Branch
              </h3>
              <p className="text-xs text-slate-400">{branch.name} ({branch.code})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-200">
          <strong>Isolated Suspension Rule:</strong> Suspending this branch blocks its members and manager access, but all other sibling branches under <em>{branch.libraryName}</em> will remain active.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reason for Suspension *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. Audit inquiry, unpaid dues, inspection pending..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none"
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 transition-all cursor-pointer"
            >
              Confirm Suspension
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
