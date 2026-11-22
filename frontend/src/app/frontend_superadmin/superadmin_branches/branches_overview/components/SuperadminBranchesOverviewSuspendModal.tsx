'use client';
// RESPONSIBILITY: Display modal dialog to temporarily suspend a branch without affecting sibling branches.
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
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-overlay-backdrop backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-overlay text-foreground shadow-dialog p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-danger-bg text-danger border border-danger-border">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 id="suspend-modal-title" className="text-base font-bold text-foreground">
                Temporarily Suspend Branch
              </h3>
              <p className="text-xs text-secondary">{branch.name} ({branch.code})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="rounded-xl border border-danger-border bg-danger-bg p-3 text-xs text-danger">
          <strong>Isolated Suspension Rule:</strong> Suspending this branch blocks its members and manager access, but all other sibling branches under <em>{branch.libraryName}</em> will remain active.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1.5">
              Reason for Suspension *
            </label>
            <textarea
              maxLength={1000}
              required
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g. Audit inquiry, unpaid dues, inspection pending..."
              className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground placeholder:text-muted focus:border-danger focus:outline-none"
            />
            {error && <p className="text-xs text-danger mt-1" role="alert">{error}</p>}
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-secondary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-danger hover:bg-danger text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              Confirm Suspension
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
