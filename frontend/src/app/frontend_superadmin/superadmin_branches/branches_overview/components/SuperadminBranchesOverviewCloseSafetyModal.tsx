'use client';
// RESPONSIBILITY: Enforce administrative safety checks and SuperAdmin software decommissioning rules before closing/archiving a branch.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Users, IndianRupee, Wallet, X, XCircle, CheckCircle2, ShieldCheck, UserX, Database, Layers } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';
import { useModalScrollLock } from '@/lib/useModalScrollLock';

interface SuperadminBranchesOverviewCloseSafetyModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
  onConfirmClose: (id: string, notes: string, forceOverride?: boolean) => { success: boolean; error?: string };
}

export default function SuperadminBranchesOverviewCloseSafetyModal({
  branch,
  onClose,
  onConfirmClose,
}: SuperadminBranchesOverviewCloseSafetyModalProps) {
  const [mounted, setMounted] = useState(false);
  const [closingNotes, setClosingNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuperadminOverride, setIsSuperadminOverride] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useModalScrollLock(Boolean(mounted));

  const hasMemberDues = branch.memberDues > 0;
  const hasBlocker = hasMemberDues;
  const canSubmit = !hasBlocker || isSuperadminOverride;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasBlocker && !isSuperadminOverride) {
      setErrorMsg('Cannot proceed with closure while unresolved liabilities exist.');
      return;
    }
    const res = isSuperadminOverride
      ? onConfirmClose(branch.id, closingNotes || 'Standard branch closure and archive', true)
      : onConfirmClose(branch.id, closingNotes || 'Standard branch closure and archive');
    if (!res.success) {
      setErrorMsg(res.error || 'Closure failed');
    } else {
      onClose();
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-overlay-backdrop backdrop-blur-sm p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-overlay p-6 shadow-dialog text-foreground flex flex-col animate-in zoom-in-95 duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground p-1 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="p-2.5 rounded-xl bg-danger-bg border border-danger-border text-danger">
            <XCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Pre-Flight Branch Closure Check</h2>
            <p className="text-xs text-secondary">Policy verification for {branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Software, Admin & Manager Governance Summary */}
          <div className="p-3.5 rounded-xl border border-border bg-surface space-y-2">
            <div className="flex items-center gap-2 text-foreground font-bold">
              <ShieldCheck size={16} className="text-primary" />
              <span>SuperAdmin Software Governance Scope</span>
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              SuperAdmin controls <strong>software licenses, admin quota allocation, and branch manager credentials</strong>.
              Internal student fee collection and physical asset custody remain operational duties managed by the Library Admin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-card border border-border flex items-center gap-1.5 text-secondary">
                <UserX size={13} className="text-warning" />
                <span>Manager Login Revoked</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border flex items-center gap-1.5 text-secondary">
                <Layers size={13} className="text-success" />
                <span>1 Plan Slot Released</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border flex items-center gap-1.5 text-secondary">
                <Database size={13} className="text-info" />
                <span>100% Records Retained</span>
              </div>
            </div>
          </div>

          {/* Condition Checklist Cards */}
          <div className="space-y-2.5">
            {/* 1. Active Student Enrollments Check */}
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Active Student Enrollments</p>
                  <p className="text-[11px] text-muted">Student accounts will be archived; seat plans soft-closed</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
                {branch.activeMembers} enrolled
              </span>
            </div>

            {/* 2. Member Dues Check */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              hasMemberDues ? 'border-danger-border bg-danger-bg' : 'border-success-border bg-success-bg'
            }`}>
              <div className="flex items-center gap-2.5">
                <IndianRupee size={16} className={hasMemberDues ? 'text-danger' : 'text-success'} />
                <div>
                  <p className="text-xs font-semibold text-foreground">Unpaid Member Dues</p>
                  <p className="text-[11px] text-secondary">All fees must be collected or formally waived by library admin</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                hasMemberDues ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'
              }`}>
                ₹{branch.memberDues.toLocaleString()}
              </span>
            </div>

            {/* 3. Financial Cash Register */}
            <div className="p-3 rounded-xl border border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wallet size={16} className="text-primary" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Branch Petty Cash Balance</p>
                  <p className="text-[11px] text-muted">Will be transferred to parent Library Account</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary border border-border">
                ₹{branch.cashBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Blocker Warning or Clean Pre-Flight */}
          {hasBlocker ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-danger-border bg-danger-bg flex items-start gap-2.5 text-xs text-danger" role="alert">
                <AlertTriangle size={16} className="text-danger shrink-0 mt-0.5" />
                <p>
                  <strong>Closure Blocked:</strong> Clear pending member dues (₹{branch.memberDues.toLocaleString()}) before standard closing.
                </p>
              </div>

              {/* SuperAdmin Software Decommissioning Override */}
              <div className="p-3 rounded-xl border border-success-border bg-success-bg space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-success">
                  <input
                    type="checkbox"
                    checked={isSuperadminOverride}
                    onChange={(e) => setIsSuperadminOverride(e.target.checked)}
                    className="mt-0.5 rounded border-success-border text-success focus:ring-success cursor-pointer"
                  />
                  <span>
                    SuperAdmin Software Override: Decommission branch software instance & manager credentials now (Student fee collection remains assigned to the Library Admin).
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-success-border bg-success-bg flex items-start gap-2.5 text-xs text-success">
              <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
              <p>
                <strong>Clean Pre-Flight:</strong> Zero liabilities found. Branch will be <strong>soft-archived</strong> (no data hard-deleted). You can restore it anytime per retention policy.
              </p>
            </div>
          )}

          {/* Archival Notes Input */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-secondary font-semibold">
              Mandatory Archival Reason / Closure Justification:
            </label>
            <textarea
              maxLength={1000}
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="e.g. Lease expired, operations merged into central hub, management decision..."
              className="w-full h-20 p-2.5 rounded-xl border border-border bg-input text-foreground placeholder:text-muted text-xs focus:outline-none focus:border-danger"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-danger font-semibold bg-danger-bg p-2.5 rounded-lg border border-danger-border" role="alert">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-border hover:bg-surface-elevated text-secondary font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              canSubmit
                ? 'bg-danger hover:bg-danger text-white shadow-sm cursor-pointer'
                : 'bg-surface text-muted cursor-not-allowed'
            }`}
          >
            Confirm Soft-Close & Archive
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
