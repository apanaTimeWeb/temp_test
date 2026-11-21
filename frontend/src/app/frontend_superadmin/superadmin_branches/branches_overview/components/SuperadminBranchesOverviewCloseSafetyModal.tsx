'use client';
// RESPONSIBILITY: Enforce administrative safety checks and SuperAdmin software decommissioning rules before closing/archiving a branch.
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, BookOpen, IndianRupee, Wallet, X, XCircle, CheckCircle2, ShieldCheck, UserX, Database, Layers } from 'lucide-react';
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

  const hasOutstandingBooks = branch.outstandingBooks > 0;
  const hasMemberDues = branch.memberDues > 0;
  const hasBlocker = hasOutstandingBooks || hasMemberDues;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-rose-500/40 bg-[#0d102b] p-6 shadow-2xl text-white flex flex-col animate-in zoom-in-95 duration-200 ease-out"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-rose-500/20">
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <XCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Pre-Flight Branch Closure Check</h2>
            <p className="text-xs text-slate-400">Policy verification for {branch.name} ({branch.code})</p>
          </div>
        </div>

        <div className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1 text-xs">
          {/* Software, Admin & Manager Governance Summary */}
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-slate-900/60 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <ShieldCheck size={16} className="text-indigo-400" />
              <span>SuperAdmin Software Governance Scope</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              SuperAdmin controls <strong>software licenses, admin quota allocation, and branch manager credentials</strong>.
              Internal student book returns and member fee recoveries are operational duties delegated to the Library Admin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/50 border border-border/40 flex items-center gap-1.5 text-slate-300">
                <UserX size={13} className="text-amber-400" />
                <span>Manager Login Revoked</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/50 border border-border/40 flex items-center gap-1.5 text-slate-300">
                <Layers size={13} className="text-emerald-400" />
                <span>1 Plan Slot Released</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/50 border border-border/40 flex items-center gap-1.5 text-slate-300">
                <Database size={13} className="text-sky-400" />
                <span>100% Records Retained</span>
              </div>
            </div>
          </div>

          {/* Condition Checklist Cards */}
          <div className="space-y-2.5">
            {/* 1. Outstanding Books Check */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              hasOutstandingBooks ? 'border-rose-500/40 bg-rose-500/10' : 'border-emerald-500/30 bg-emerald-500/10'
            }`}>
              <div className="flex items-center gap-2.5">
                <BookOpen size={16} className={hasOutstandingBooks ? 'text-rose-400' : 'text-emerald-400'} />
                <div>
                  <p className="text-xs font-semibold text-white">Outstanding Issued Books</p>
                  <p className="text-[11px] text-slate-400">Must be returned or transferred to parent catalogue</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                hasOutstandingBooks ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {branch.outstandingBooks} pending
              </span>
            </div>

            {/* 2. Member Dues Check */}
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              hasMemberDues ? 'border-rose-500/40 bg-rose-500/10' : 'border-emerald-500/30 bg-emerald-500/10'
            }`}>
              <div className="flex items-center gap-2.5">
                <IndianRupee size={16} className={hasMemberDues ? 'text-rose-400' : 'text-emerald-400'} />
                <div>
                  <p className="text-xs font-semibold text-white">Unpaid Member Dues</p>
                  <p className="text-[11px] text-slate-400">All fees must be collected or formally waived</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                hasMemberDues ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                ₹{branch.memberDues.toLocaleString()}
              </span>
            </div>

            {/* 3. Financial Cash Register */}
            <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wallet size={16} className="text-indigo-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Branch Petty Cash Balance</p>
                  <p className="text-[11px] text-slate-400">Will be transferred to parent Library Account</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                ₹{branch.cashBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Blocker Warning or Clean Pre-Flight */}
          {hasBlocker ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 flex items-start gap-2.5 text-xs text-rose-300">
                <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Closure Blocked:</strong> Resolve all outstanding book returns ({branch.outstandingBooks}) and clear pending member dues (₹{branch.memberDues}) before closing.
                </p>
              </div>

              {/* SuperAdmin Software Decommissioning Override */}
              <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-emerald-200">
                  <input
                    type="checkbox"
                    checked={isSuperadminOverride}
                    onChange={(e) => setIsSuperadminOverride(e.target.checked)}
                    className="mt-0.5 rounded border-emerald-500/40 text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                  />
                  <span>
                    SuperAdmin Software Override: Decommission branch software instance & manager credentials now (Student book returns and fee recovery remain assigned to the Library Admin).
                  </span>
                </label>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Clean Pre-Flight:</strong> Zero liabilities found. Branch will be <strong>soft-archived</strong> (no data hard-deleted). You can restore it anytime per retention policy.
              </p>
            </div>
          )}

          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Notes / Closure Reason</label>
              <textarea
                rows={2}
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                placeholder="e.g. Lease expired, relocated to new premises, or operational consolidation..."
                className="w-full rounded-xl border border-indigo-500/30 bg-slate-900/80 p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-rose-400 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                  canSubmit
                    ? 'bg-rose-600 hover:bg-rose-500 active:scale-95'
                    : 'bg-rose-900/40 text-slate-400 border border-rose-500/20 cursor-not-allowed opacity-40'
                }`}
              >
                Confirm Soft-Close & Archive
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
