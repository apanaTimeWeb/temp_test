'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Clock } from 'lucide-react';
import type { UserSecurityAccount } from '../types/SuperadminRolesPermissionsManagementTypes';

interface SuperadminUserSecurityControlsTabProps {
  user: UserSecurityAccount;
  onToggleLock: (userId: string, reason?: string) => void;
  onTriggerPasswordReset: (userId: string) => string;
  onResetMfa: (userId: string) => void;
  onGrantTemporaryPermission: (userId: string, days: number, note: string) => void;
  showFeedback: (msg: string) => void;
}

export default function SuperadminUserSecurityControlsTab({
  user,
  onToggleLock,
  onTriggerPasswordReset,
  onResetMfa,
  onGrantTemporaryPermission,
  showFeedback,
}: SuperadminUserSecurityControlsTabProps) {
  const [showLockPrompt, setShowLockPrompt] = useState(false);
  const [lockReason, setLockReason] = useState('Security audit alert');
  const [showMfaConfirm, setShowMfaConfirm] = useState(false);
  const [tempDays, setTempDays] = useState(7);
  const [tempNote, setTempNote] = useState('');

  const handlePasswordReset = () => {
    const msg = onTriggerPasswordReset(user.id);
    showFeedback(msg);
  };

  const handleGrantTemp = (e: React.FormEvent) => {
    e.preventDefault();
    onGrantTemporaryPermission(user.id, tempDays, tempNote.trim() || 'Temporary operational duty');
    showFeedback(`Temporary elevated permissions granted for ${tempDays} days.`);
  };

  return (
    <div className="space-y-3.5">
      {/* Account Lock Toggle */}
      <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-white flex items-center gap-1.5">
              {user.isLocked ? <Lock size={14} className="text-rose-400" /> : <Unlock size={14} className="text-emerald-400" />}
              Account Access Lock
            </p>
            <p className="text-slate-400 mt-0.5">Immediately blocks login and terminates active sessions.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (user.isLocked) {
                onToggleLock(user.id, '');
                showFeedback('Account unlocked successfully.');
              } else {
                onToggleLock(user.id, lockReason || 'Security audit alert');
                showFeedback('Account locked and all sessions terminated.');
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              user.isLocked ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {user.isLocked ? 'Unlock Account' : 'Lock Account'}
          </button>
        </div>
      </div>

      {/* Password Reset */}
      <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="font-bold text-white">Trigger Secure Password Reset</p>
          <p className="text-slate-400 mt-0.5">Dispatches a one-time invitation link to user email.</p>
        </div>
        <button
          type="button"
          onClick={handlePasswordReset}
          className="px-3.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 hover:text-white hover:bg-indigo-600/30 font-bold cursor-pointer"
        >
          Send Reset Link
        </button>
      </div>

      {/* MFA Reset */}
      <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-slate-900/60 flex items-center justify-between">
        <div>
          <p className="font-bold text-white">MFA Security Reset</p>
          <p className="text-slate-400 mt-0.5">Status: {user.mfaEnabled ? 'MFA Configured & Active' : 'MFA Not Enrolled'}</p>
        </div>
        {showMfaConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-300 font-semibold">Confirm MFA Reset?</span>
            <button
              type="button"
              onClick={() => setShowMfaConfirm(false)}
              className="px-2 py-1 text-[11px] rounded border border-slate-700 text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onResetMfa(user.id);
                setShowMfaConfirm(false);
                showFeedback('MFA reset. User must re-enroll MFA on next login.');
              }}
              className="px-2.5 py-1 text-[11px] rounded bg-amber-600 text-white font-bold cursor-pointer"
            >
              Yes, Reset
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowMfaConfirm(true)}
            disabled={!user.mfaEnabled}
            className="px-3.5 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/15 text-amber-300 hover:text-white hover:bg-amber-600/30 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Reset MFA Token
          </button>
        )}
      </div>

      {/* Temporary Permissions Expiry */}
      <form onSubmit={handleGrantTemp} className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2.5">
        <p className="font-bold text-purple-300">Grant Temporary Permissions with Auto-Expiry</p>
        <div className="flex items-center gap-3">
          <div className="w-1/3">
            <label className="text-[11px] text-slate-400">Duration</label>
            <select
              value={tempDays}
              onChange={(e) => setTempDays(Number(e.target.value))}
              className="w-full mt-1 rounded-lg border border-purple-500/30 bg-input p-1.5 text-xs text-white"
            >
              <option value={1}>24 Hours</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[11px] text-slate-400">Audit Justification / Note</label>
            <input
              type="text"
              placeholder="e.g. Interim duty cover during vacation"
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              className="w-full mt-1 rounded-lg border border-purple-500/30 bg-input p-1.5 text-xs text-white"
            />
          </div>
        </div>
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer text-xs"
          >
            <Clock size={12} />
            <span>Apply Temporary Permission</span>
          </button>
        </div>
      </form>
    </div>
  );
}
