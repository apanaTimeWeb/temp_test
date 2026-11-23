'use client';

import React from 'react';
import { Key, ShieldCheck, X } from 'lucide-react';
import { SUPERADMIN_SUPPORT_ACCESS_DURATIONS } from '../constants/SuperadminSupportTicketsOverviewConstants';

interface SuperadminSupportTicketsGrantAccessModalProps {
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

export default function SuperadminSupportTicketsGrantAccessModal({
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
}: SuperadminSupportTicketsGrantAccessModalProps) {
  if (!showGrantAccessModal) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowGrantAccessModal(false);
      }}
    >
      <div className="bg-[#0a0e28] border border-indigo-500/40 rounded-2xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl text-white my-auto animate-in zoom-in-95 duration-150 ease-out" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
              <Key size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Authorize Time-Limited Support Access</h3>
              <p className="text-[11px] text-slate-400">Zero-Trust elevated delegation for member record troubleshooting</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowGrantAccessModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Access Lease Duration</label>
            <select
              value={accessDuration}
              onChange={(e) => setAccessDuration(Number(e.target.value))}
              className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              {SUPERADMIN_SUPPORT_ACCESS_DURATIONS.map((d) => (
                <option key={d.minutes} value={d.minutes}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Access Scope</label>
            <select
              value={accessScope}
              onChange={(e) => setAccessScope(e.target.value as 'Read-Only Diagnostics' | 'Full Troubleshooting Mutation')}
              className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 px-3 py-2 text-xs text-white outline-none cursor-pointer"
            >
              <option value="Read-Only Diagnostics">Read-Only Diagnostics (Masked Member Records)</option>
              <option value="Full Troubleshooting Mutation">Full Troubleshooting Mutation (Audited Data Repair)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Mandatory Justification *</label>
            <textarea maxLength={1000}
              rows={3}
              placeholder="e.g. Diagnosing corrupted student seat assignment ledger for Ticket #TKT-991"
              value={accessJustification}
              onChange={(e) => setAccessJustification(e.target.value)}
              className="w-full rounded-xl border border-indigo-500/30 bg-slate-950 p-2.5 text-xs text-white outline-none resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck size={13} />
              Privacy Governance Rule
            </p>
            <p>
              Access automatically expires when duration lapses. Every member query during this session will be logged to immutable SuperAdmin audit logs.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setShowGrantAccessModal(false)}
            className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white active:scale-[0.97] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onGrantAccessSubmit}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-xs font-bold text-white shadow-md cursor-pointer active:scale-[0.97]"
          >
            {t('COPY.GRANT_ACCESS')}
          </button>
        </div>
      </div>
    </div>
  );
}
