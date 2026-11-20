'use client';
// RESPONSIBILITY: Enforce mandatory pre-flight safety checks (books, dues, cash) before soft-closing a branch.
import { useState } from 'react';
import { AlertTriangle, BookOpen, IndianRupee, Wallet, X, XCircle, CheckCircle2 } from 'lucide-react';
import type { SuperadminBranchRecord } from '@/app/frontend_superadmin/superadmin_branches/branches_overview/types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewCloseSafetyModalProps {
  branch: SuperadminBranchRecord;
  onClose: () => void;
  onConfirmClose: (id: string, notes: string) => { success: boolean; error?: string };
}

export default function SuperadminBranchesOverviewCloseSafetyModal({
  branch,
  onClose,
  onConfirmClose,
}: SuperadminBranchesOverviewCloseSafetyModalProps) {
  const [closingNotes, setClosingNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const hasOutstandingBooks = branch.outstandingBooks > 0;
  const hasMemberDues = branch.memberDues > 0;
  const hasBlocker = hasOutstandingBooks || hasMemberDues;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasBlocker) {
      setErrorMsg('Cannot proceed with closure while unresolved liabilities exist.');
      return;
    }
    const res = onConfirmClose(branch.id, closingNotes || 'Standard branch closure and archive');
    if (!res.success) {
      setErrorMsg(res.error || 'Closure failed');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/40 bg-[#0d102b] p-6 shadow-2xl text-white">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 pb-4 border-b border-rose-500/20">
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <XCircle size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Pre-Flight Branch Closure Check</h2>
            <p className="text-xs text-slate-400">Policy verification for {branch.name} ({branch.code})</p>
          </div>
        </div>

        {/* ── Condition Checklist Cards ── */}
        <div className="my-5 space-y-3">
          {/* 1. Outstanding Books Check */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
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
          <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
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
          <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-between">
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

        {/* ── Blocker Warning or Soft-Delete Reassurance ── */}
        {hasBlocker ? (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-950/40 flex items-start gap-2.5 text-xs text-rose-300 mb-4">
            <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
            <p>
              <strong>Closure Blocked:</strong> Resolve all outstanding book returns ({branch.outstandingBooks}) and clear pending member dues (₹{branch.memberDues}) before closing.
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 flex items-start gap-2.5 text-xs text-emerald-300 mb-4">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Clean Pre-Flight:</strong> Zero liabilities found. Branch will be <strong>soft-archived</strong> (no data hard-deleted). You can restore it anytime per retention policy.
            </p>
          </div>
        )}

        {errorMsg && <p className="text-xs text-rose-400 mb-3">{errorMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Audit Notes / Closure Reason</label>
            <textarea
              rows={2}
              value={closingNotes}
              onChange={(e) => setClosingNotes(e.target.value)}
              placeholder="e.g. Lease expired, relocated to new premises, or operational consolidation..."
              className="w-full rounded-xl border border-indigo-500/30 bg-input p-2.5 text-xs text-white placeholder:text-slate-500 focus:border-rose-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasBlocker}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm Soft-Close & Archive
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
