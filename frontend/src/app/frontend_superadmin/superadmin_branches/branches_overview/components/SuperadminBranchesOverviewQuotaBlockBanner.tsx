'use client';
// RESPONSIBILITY: Display branch limit overage warning, upgrade plan CTA, and additional branch expansion request form.
import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowUpRight, CheckCircle2, Send, ShieldAlert } from 'lucide-react';
import type { SuperadminLibraryOption } from '../types/SuperadminBranchesOverviewTypes';

interface SuperadminBranchesOverviewQuotaBlockBannerProps {
  library: SuperadminLibraryOption;
  onRequestSubmitted?: (note: string) => void;
}

export default function SuperadminBranchesOverviewQuotaBlockBanner({
  library,
  onRequestSubmitted,
}: SuperadminBranchesOverviewQuotaBlockBannerProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestNote.trim()) return;
    setIsSubmitted(true);
    setShowRequestForm(false);
    onRequestSubmitted?.(requestNote.trim());
  };

  return (
    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 space-y-3" role="alert">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs font-bold text-rose-300">
              Branch Creation Blocked — Plan Limit Reached
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
              {library.currentBranchCount} of {library.maxBranchesAllowed} Branches Used
            </span>
          </div>
          <p className="text-xs text-rose-200/80 mt-1 leading-relaxed">
            Library <strong>{library.name}</strong> has already provisioned all {library.maxBranchesAllowed} allowed branches in its current plan. Creating an additional 4th branch requires upgrading the plan or obtaining SuperAdmin expansion approval.
          </p>
        </div>
      </div>

      {isSubmitted ? (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Branch expansion request submitted to SuperAdmin. You will be notified once reviewed.</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-rose-500/20">
          {/* Upgrade Plan CTA */}
          <Link
            href="/superadmin/superadmin_plans"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold transition-all shadow-xs"
          >
            Upgrade Plan <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          {/* Request Additional Branch CTA */}
          <button
            type="button"
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-400/50 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {showRequestForm ? 'Cancel Request' : 'Request Additional Branch'}
          </button>
        </div>
      )}

      {/* Inline Branch Expansion Request Form */}
      {showRequestForm && !isSubmitted && (
        <form onSubmit={handleSendRequest} className="mt-2.5 p-3 rounded-lg bg-black/40 border border-rose-500/30 space-y-2.5">
          <label className="block text-2xs font-semibold text-slate-300 uppercase tracking-wider">
            Business Justification for 4th Branch
          </label>
          <textarea maxLength={1000}
            rows={2}
            value={requestNote}
            onChange={(e) => setRequestNote(e.target.value)}
            placeholder="e.g. Opening new branch in South Delhi campus next month with 120 seats capacity..."
            className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white placeholder:text-slate-500 focus:border-rose-400 outline-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-xs"
            >
              Submit Request to SuperAdmin
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
