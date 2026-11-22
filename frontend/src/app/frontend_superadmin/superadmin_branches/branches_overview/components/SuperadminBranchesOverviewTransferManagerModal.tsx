'use client';
// RESPONSIBILITY: Handle manager transfer assignment with mandatory audit reasoning.
import { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewTransferManagerModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
  onConfirmTransfer: (id: string, newManager: { name: string; email: string; phone: string }, reason: string) => void;
}

export default function SuperadminBranchesOverviewTransferManagerModal({
  branch,
  onClose,
  onConfirmTransfer,
}: SuperadminBranchesOverviewTransferManagerModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !reason.trim()) {
      setError('Please provide the new manager name, email, and transfer reason.');
      return;
    }
    onConfirmTransfer(branch.id, { name: name.trim(), email: email.trim(), phone: phone.trim() }, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-info-bg border border-info-border text-info">
            <UserCheck size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Transfer Branch Manager</h2>
            <p className="text-xs text-secondary">{branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-4 p-3 rounded-xl border border-border bg-card text-xs text-secondary">
          <p className="text-muted">Current Manager:</p>
          <p className="font-semibold text-foreground mt-0.5">{branch.managerName} ({branch.managerEmail})</p>
          <p className="text-[11px] text-muted mt-1">Branch Manager role grants access strictly to this branch desk only.</p>
        </div>

        {error && <p className="text-xs text-danger mb-3" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">New Manager Name *</label>
            <input
              maxLength={100}
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">New Manager Email *</label>
            <input
              maxLength={254}
              type="email"
              placeholder="ramesh@libraryos.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Contact Phone</label>
            <input
              maxLength={15}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground focus:border-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">Transfer Reason / Audit Note *</label>
            <textarea
              maxLength={1000}
              rows={2}
              placeholder="e.g. Relocation, role rotation, or new staff appointment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-border bg-input p-2 text-xs text-foreground placeholder:text-muted focus:border-primary outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-xs font-bold text-on-primary shadow-sm active:scale-95 transition-all cursor-pointer motion-safe:active:scale-95"
            >
              Confirm Transfer & Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
