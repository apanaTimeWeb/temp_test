// components/SuperadminSecurityOverviewGovernanceCard.tsx
// RESPONSIBILITY: Display SuperAdmin governance rules, dual-approval workflow, emergency break-glass accounts, and controlled impersonation.
'use client';

import { AlertCircle, Clock, Eye, Key, Lock, Shield, UserCheck, Users } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

export const SuperadminSecurityOverviewGovernanceCard: React.FC = () => {
  const [impersonateTarget, setImpersonateTarget] = useState('admin.delhi@libraryos.com');
  const [impersonateDuration, setImpersonateDuration] = useState('15');
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [mandatoryReason, setMandatoryReason] = useState('');
  const [isStartingSession, setIsStartingSession] = useState(false);

  const emergencyAccounts = [
    {
      email: 'breakglass.primary@libraryos.internal',
      role: 'Emergency Root SuperAdmin',
      status: 'Protected / Immutable',
      keyFingerprint: 'SHA256:8f9a••••••••901c',
    },
    {
      email: 'breakglass.secondary@libraryos.internal',
      role: 'Emergency Backup SuperAdmin',
      status: 'Protected / Immutable',
      keyFingerprint: 'SHA256:77bc••••••••551d',
    },
  ];

  const handleStartImpersonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mandatoryReason.trim() || mandatoryReason.trim().length < 10) {
      toast.error('Audit Compliance: Mandatory reason (minimum 10 characters) is required to impersonate.');
      return;
    }
    setIsStartingSession(true);
    setTimeout(() => {
      setIsStartingSession(false);
      toast.success(
        `Time-Limited Impersonation Started for ${impersonateTarget} (${impersonateDuration} mins, ${isReadOnly ? 'Read-Only' : 'Read-Write'}). Session ID logged to Audit Trail.`,
        { id: 'impersonate-started' }
      );
      setMandatoryReason('');
    }, 600);
  };

  return (
    <section className="rounded-2xl border border-amber-500/25 bg-gradient-to-b from-[#181108]/90 via-[#0a0d24]/95 to-[#060818] p-5 sm:p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-500/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              SuperAdmin Governance & Four-Eyes Safeguards
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                Controlled Authority Protocol
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dual-authorization for SuperAdmin removals, break-glass emergency accounts, and read-only impersonation controls
            </p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
          Zero-Lockout Invariant: Enforced
        </span>
      </div>

      {/* Governance Invariant Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-3.5 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Users size={14} className="text-amber-400" />
            <span>Dual-Authorization Law</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            No single SuperAdmin can delete or demote another SuperAdmin without secondary approval from a second verified SuperAdmin.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-3.5 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Key size={14} className="text-purple-400" />
            <span>2 Emergency Accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            System maintains 2 protected hardware break-glass accounts that cannot be deleted or locked under any circumstance.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-3.5 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Lock size={14} className="text-emerald-400" />
            <span>Step-Up Authentication</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            MFA re-verification required for permission escalations, tenant deletions, and master payment gateway changes.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-3.5 space-y-1.5">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <AlertCircle size={14} className="text-rose-400" />
            <span>Last Admin Invariant</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Backend hard-rejects any mutation that would delete or disable the last remaining active SuperAdmin account.
          </p>
        </div>
      </div>

      {/* Break-glass accounts table & Time-limited Impersonation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
        {/* Break-glass accounts */}
        <div className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-4 space-y-2.5 text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <UserCheck size={14} className="text-emerald-400" />
            Hardware Break-Glass Emergency Accounts (Read-Only Status)
          </span>
          <div className="space-y-2">
            {emergencyAccounts.map((acc) => (
              <div
                key={acc.email}
                className="rounded-lg border border-indigo-500/20 bg-[#0a0d24] p-2.5 flex items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <span className="font-mono font-semibold text-slate-100 text-xs block">{acc.email}</span>
                  <span className="text-[10px] text-slate-400">FP: {acc.keyFingerprint}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {acc.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Impersonation Controls Form */}
        <form onSubmit={handleStartImpersonation} className="rounded-xl border border-indigo-500/20 bg-[#07091a]/80 p-4 space-y-2.5 text-xs">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Eye size={14} className="text-indigo-400" />
            Time-Limited & Logged Admin Impersonation
          </span>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Target Admin Account</label>
              <select
                value={impersonateTarget}
                onChange={(e) => setImpersonateTarget(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-[#0a0d24] px-2.5 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-400"
              >
                <option value="admin.delhi@libraryos.com">admin.delhi@libraryos.com (Delhi Branch)</option>
                <option value="admin.mumbai@libraryos.com">admin.mumbai@libraryos.com (Mumbai Branch)</option>
                <option value="manager.bangalore@libraryos.com">manager.bangalore@libraryos.com</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 text-[11px]">Session Duration (Max 60m)</label>
              <select
                value={impersonateDuration}
                onChange={(e) => setImpersonateDuration(e.target.value)}
                className="w-full rounded-xl border border-indigo-500/30 bg-[#0a0d24] px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-400"
              >
                <option value="15">15 Minutes (Default)</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes (Requires VP Approval)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={isReadOnly}
                onChange={(e) => setIsReadOnly(e.target.checked)}
                className="rounded border-indigo-500/40 text-indigo-600 focus:ring-indigo-400"
              />
              <span className="font-semibold text-slate-200">Enforce Read-Only Mode (Recommended)</span>
            </label>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock size={11} /> Auto-terminates after {impersonateDuration}m
            </span>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 text-[11px]">
              Mandatory Business Reason (Logged to Immutable Audit Trail)
            </label>
            <input maxLength={250}
              type="text"
              required
              value={mandatoryReason}
              onChange={(e) => setMandatoryReason(e.target.value)}
              placeholder="e.g. Investigating membership invoice mismatch ticket #9921"
              className="w-full rounded-xl border border-indigo-500/30 bg-[#0a0d24] px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
            />
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="submit"
              disabled={isStartingSession}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-600/25 hover:shadow-indigo-500/35 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Eye size={13} />
              <span>{isStartingSession ? 'Authorizing Session...' : 'Start Impersonation Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
