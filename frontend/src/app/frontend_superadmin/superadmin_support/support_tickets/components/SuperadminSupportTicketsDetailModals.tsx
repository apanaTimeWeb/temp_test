'use client';

import React from 'react';
import { CheckCircle2, RotateCcw, X, Zap } from 'lucide-react';
import { SUPERADMIN_SUPPORT_ESCALATION_TIERS } from '../constants/SuperadminSupportTicketsOverviewConstants';
import SuperadminSupportTicketsGrantAccessModal from './SuperadminSupportTicketsGrantAccessModal';

interface SuperadminSupportTicketsDetailModalsProps {
  showEscalateModal: boolean;
  setShowEscalateModal: (val: boolean) => void;
  escalateTier: (typeof SUPERADMIN_SUPPORT_ESCALATION_TIERS)[number];
  setEscalateTier: (val: (typeof SUPERADMIN_SUPPORT_ESCALATION_TIERS)[number]) => void;
  escalateReason: string;
  setEscalateReason: (val: string) => void;
  onEscalateSubmit: () => void;

  showResolveModal: boolean;
  setShowResolveModal: (val: boolean) => void;
  resolutionNotes: string;
  setResolutionNotes: (val: string) => void;
  rootCause: string;
  setRootCause: (val: string) => void;
  onResolveSubmit: () => void;

  showReopenModal: boolean;
  setShowReopenModal: (val: boolean) => void;
  reopenReason: string;
  setReopenReason: (val: string) => void;
  onReopenSubmit: () => void;

  showGrantAccessModal: boolean;
  setShowGrantAccessModal: (val: boolean) => void;
  accessDuration: number;
  setAccessDuration: (val: number) => void;
  accessScope: 'Read-Only Diagnostics' | 'Full Troubleshooting Mutation';
  setAccessScope: (val: 'Read-Only Diagnostics' | 'Full Troubleshooting Mutation') => void;
  accessJustification: string;
  setAccessJustification: (val: string) => void;
  onGrantAccessSubmit: () => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

export default function SuperadminSupportTicketsDetailModals({
  showEscalateModal,
  setShowEscalateModal,
  escalateTier,
  setEscalateTier,
  escalateReason,
  setEscalateReason,
  onEscalateSubmit,

  showResolveModal,
  setShowResolveModal,
  resolutionNotes,
  setResolutionNotes,
  rootCause,
  setRootCause,
  onResolveSubmit,

  showReopenModal,
  setShowReopenModal,
  reopenReason,
  setReopenReason,
  onReopenSubmit,

  showGrantAccessModal,
  setShowGrantAccessModal,
  accessDuration,
  setAccessDuration,
  accessScope,
  setAccessScope,
  accessJustification,
  setAccessJustification,
  onGrantAccessSubmit,
  t,
}: SuperadminSupportTicketsDetailModalsProps) {
  return (
    <>
      {/* Escalate Modal Dialog */}
      {showEscalateModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEscalateModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-red-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-150 ease-out" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-red-400">
                <Zap size={16} />
                <span>Escalate Support Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowEscalateModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Escalation Tier</label>
                <select
                  value={escalateTier}
                  onChange={(e) => setEscalateTier(e.target.value as typeof SUPERADMIN_SUPPORT_ESCALATION_TIERS[number])}
                  className="w-full rounded-xl border border-red-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  {SUPERADMIN_SUPPORT_ESCALATION_TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Escalation *</label>
                <textarea maxLength={1000}
                  rows={3}
                  placeholder="Describe why standard Tier-1 resolution is blocked..."
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  className="w-full rounded-xl border border-red-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEscalateModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onEscalateSubmit}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal Dialog */}
      {showResolveModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowResolveModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-emerald-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-150 ease-out" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400">
                <CheckCircle2 size={16} />
                <span>Resolve Support Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowResolveModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Resolution Summary *</label>
                <textarea maxLength={1000}
                  rows={3}
                  placeholder="Describe the fix or actions taken to resolve the tenant issue..."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Root Cause Analysis</label>
                <input maxLength={100}
                  type="text"
                  placeholder="e.g. Memory leak in background worker / Network gateway timeout"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full rounded-xl border border-emerald-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onResolveSubmit}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Modal Dialog */}
      {showReopenModal && (
        <div
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReopenModal(false);
          }}
        >
          <div className="bg-[#0e122b] border border-purple-500/40 rounded-2xl p-5 sm:p-6 max-w-md w-full space-y-4 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-150 ease-out" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400">
                <RotateCcw size={16} />
                <span>Reopen Ticket</span>
              </h3>
              <button type="button" onClick={() => setShowReopenModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Reopening *</label>
                <textarea maxLength={1000}
                  rows={3}
                  placeholder="Specify why the issue recurred or remains unresolved..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full rounded-xl border border-purple-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowReopenModal(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onReopenSubmit}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
              >
                Reopen Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Time-Limited Support Access Modal */}
      <SuperadminSupportTicketsGrantAccessModal
        showGrantAccessModal={showGrantAccessModal}
        setShowGrantAccessModal={setShowGrantAccessModal}
        accessDuration={accessDuration}
        setAccessDuration={setAccessDuration}
        accessScope={accessScope}
        setAccessScope={setAccessScope}
        accessJustification={accessJustification}
        setAccessJustification={setAccessJustification}
        onGrantAccessSubmit={onGrantAccessSubmit}
        t={t}
      />
    </>
  );
}
