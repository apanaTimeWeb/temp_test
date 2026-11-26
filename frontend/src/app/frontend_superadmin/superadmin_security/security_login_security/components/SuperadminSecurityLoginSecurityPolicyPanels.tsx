'use client';
/** Responsibility: Superadmin Security Policy Panels; full interactive management of Login Security, rate limiting, brute force defense, lockout & recovery, session expiry, and invite lifecycles. */
import { useState } from 'react';
import { useSuperadminSecurityLoginSecurityValidationMessage } from '@/app/frontend_superadmin/superadmin_security/security_login_security/hooks/useSuperadminSecurityLoginSecurityValidationMessage';
import { ShieldAlert, Clock, LogOut, ShieldCheck, Mail, Zap, Globe2, KeyRound, Timer } from 'lucide-react';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_login_security/types/SuperadminSecurityLoginSecurityPolicyPanelsComponentTypes';
import SuperadminSecurityLoginSecurityLockedAccountsTable, {
  type LockedAccount,
} from '@/app/frontend_superadmin/superadmin_security/security_login_security/components/SuperadminSecurityLoginSecurityLockedAccountsTable';
import { toast } from 'sonner';

const INITIAL_LOCKED_ACCOUNTS: LockedAccount[] = [
  { id: 'lck-001', email: 'finance.lead@libraryos.com', role: 'Admin', failedCount: 6, lockedAt: '12 minutes ago', ip: '198.51.100.9', reason: 'Repeated bad password attempts' },
  { id: 'lck-002', email: 'librarian.pune@libraryos.com', role: 'BranchManager', failedCount: 5, lockedAt: '45 minutes ago', ip: '203.0.113.88', reason: 'Failed TOTP verification spike' },
];

export default function SuperadminSecurityLoginSecurityPolicyPanels({
  activeTab,
  loginRegister,
  loginErrors,
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const translateValidationMessage = useSuperadminSecurityLoginSecurityValidationMessage();
  const [progressiveDelay, setProgressiveDelay] = useState(true);
  const [ipAutoQuarantine, setIpAutoQuarantine] = useState(true);
  const [captchaTrigger, setCaptchaTrigger] = useState(true);
  const [singleConcurrentSession, setSingleConcurrentSession] = useState(true);
  const [inviteExpiryHours, setInviteExpiryHours] = useState(24);
  const [resetTokenExpiryMins, setResetTokenExpiryMins] = useState(15);
  const [suspiciousTravelAlert, setSuspiciousTravelAlert] = useState(true);
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>(INITIAL_LOCKED_ACCOUNTS);

  const handleUnlockAccount = (id: string, email: string) => {
    setLockedAccounts((prev) => prev.filter((acc) => acc.id !== id));
    toast.success(`Account unlocked: ${email}. Failed attempt counter reset.`, { id: `unlock-${id}` });
  };

  const handleSendRecoveryLink = (email: string) => {
    toast.success(`Secure recovery link (${resetTokenExpiryMins}-min expiry) dispatched to ${email}`, { id: `recovery-${email}` });
  };

  if (activeTab !== 'Login Security') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl space-y-5 motion-safe:animate-fade-in motion-reduce:animate-none">
      {/* 1. Header & Posture */}
      <div className="border-b border-border/80 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
            <ShieldAlert size={20} className="text-amber-400" />
            <span>Login Security, Rate Limiting & Account Protection</span>
          </h2>
          <p className="text-xs text-slate-400">
            Defend administrative and staff portals against credential stuffing, brute-force attacks, and session hijacking.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 shrink-0">
          <Zap size={13} /> Active Brute-Force Shields
        </span>
      </div>

      {/* 2. Brute Force Protection & Progressive Delay */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Rate Limiting & Brute-Force Defense</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="security-max-failed-attempts" className="text-xs font-semibold text-slate-200">Max Failed Attempts (Before Lockout)</label>
            <input maxLength={30}
              id="security-max-failed-attempts"
              type="number"
              min={3}
              max={15}
              className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 focus:border-indigo-400 focus:outline-none"
              {...loginRegister('maxFailed', { valueAsNumber: true })}
              data-testid="superadmin-login-security-max-failed"
            />
            {loginErrors.maxFailed?.message && (
              <p className="text-xs text-rose-400 font-medium">{translateValidationMessage(loginErrors.maxFailed.message)}</p>
            )}
            <p className="text-[11px] text-slate-400">Triggers account lockout after 5 consecutive failures</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="security-lock-duration" className="text-xs font-semibold text-slate-200">Account Lockout Duration (Minutes)</label>
            <input maxLength={30}
              id="security-lock-duration"
              type="number"
              min={5}
              max={1440}
              className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 focus:border-indigo-400 focus:outline-none"
              {...loginRegister('lockDuration', { valueAsNumber: true })}
              data-testid="superadmin-login-security-lock-duration"
            />
            {loginErrors.lockDuration?.message && (
              <p className="text-xs text-rose-400 font-medium">{translateValidationMessage(loginErrors.lockDuration.message)}</p>
            )}
            <p className="text-[11px] text-slate-400">Auto-unlocks after 30 minutes or requires SuperAdmin approval</p>
          </div>
        </div>

        {/* Behavioral Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-[#07091a]/60">
            <div>
              <p className="text-xs font-bold text-slate-200">Progressive Backoff Delay</p>
              <p className="text-[11px] text-slate-400">Adds 2s, 5s delay on retries</p>
            </div>
            <input type="checkbox" checked={progressiveDelay} onChange={(e) => setProgressiveDelay(e.target.checked)} className="h-4 w-4 rounded accent-indigo-500 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-[#07091a]/60">
            <div>
              <p className="text-xs font-bold text-slate-200">IP Auto-Quarantine (WAF)</p>
              <p className="text-[11px] text-slate-400">Blocks IP after 10 failed logins</p>
            </div>
            <input type="checkbox" checked={ipAutoQuarantine} onChange={(e) => setIpAutoQuarantine(e.target.checked)} className="h-4 w-4 rounded accent-indigo-500 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-500/20 bg-[#07091a]/60">
            <div>
              <p className="text-xs font-bold text-slate-200">Trigger CAPTCHA Challenge</p>
              <p className="text-[11px] text-slate-400">After 3 invalid attempts</p>
            </div>
            <input type="checkbox" checked={captchaTrigger} onChange={(e) => setCaptchaTrigger(e.target.checked)} className="h-4 w-4 rounded accent-indigo-500 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* 3. Session Lifecycle & Inactive Timeout */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Clock size={16} className="text-sky-400" />
          <span>Session Lifecycle & Inactive Timeout</span>
        </h3>
        <div className="p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-xl space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="security-session-timeout" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Timer size={14} className="text-sky-400" />
                <span>Inactive Session Timeout (Minutes)</span>
              </label>
              <input maxLength={30}
                id="security-session-timeout"
                type="number"
                min={5}
                max={480}
                className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 focus:border-indigo-400 focus:outline-none"
                {...loginRegister('sessionTimeout', { valueAsNumber: true })}
                data-testid="superadmin-login-security-session-timeout"
              />
              {loginErrors.sessionTimeout?.message && (
                <p className="text-xs text-rose-400 font-medium">{translateValidationMessage(loginErrors.sessionTimeout.message)}</p>
              )}
              <p className="text-[11px] text-slate-400">Idle screens auto-lock and blur after 15 minutes</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="security-reset-token-expiry" className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <KeyRound size={14} className="text-sky-400" />
                <span>Password Reset Link Expiry (Minutes)</span>
              </label>
              <input maxLength={30}
                id="security-reset-token-expiry"
                type="number"
                min={5}
                max={60}
                value={resetTokenExpiryMins}
                onChange={(e) => setResetTokenExpiryMins(Number(e.target.value))}
                className="rounded-xl border border-indigo-500/30 bg-[#07091a]/85 px-3 py-2 text-xs text-slate-100 focus:border-indigo-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">Single-use cryptographically sealed tokens (15 mins)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-indigo-500/20">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/20 bg-[#07091a]/60">
              <div className="flex items-center gap-2">
                <LogOut size={16} className="text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Force Logout on Password Reset</h4>
                  <p className="text-[11px] text-slate-400">Instantly revokes all active refresh tokens</p>
                </div>
              </div>
              <label className="sa-toggle cursor-pointer">
                <input id="security-force-logout" type="checkbox" {...loginRegister('forceLogout')} data-testid="superadmin-login-security-force-logout" />
                <span className="sa-slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-indigo-500/20 bg-[#07091a]/60">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Single Concurrent SuperAdmin Session</h4>
                  <p className="text-[11px] text-slate-400">Terminates older login on new device</p>
                </div>
              </div>
              <label className="sa-toggle cursor-pointer">
                <input type="checkbox" checked={singleConcurrentSession} onChange={(e) => setSingleConcurrentSession(e.target.checked)} />
                <span className="sa-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Admin Invitation & Suspicious Login Detection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-indigo-400" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-100">Admin Invitation Link Expiry</h4>
          </div>
          <p className="text-xs text-slate-400">Invitation links sent to new Library Admins or staff automatically expire to prevent email snooping.</p>
          <div className="flex items-center gap-2 pt-1">
            {[24, 48, 72].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setInviteExpiryHours(hours)}
                className={`flex-1 py-1 text-xs font-bold rounded-xl border motion-safe:transition-all cursor-pointer ${
                  inviteExpiryHours === hours ? 'border-indigo-400 bg-indigo-500/25 text-indigo-300 shadow-sm' : 'border-indigo-500/20 bg-[#07091a]/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {hours} Hours
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 size={16} className="text-cyan-400" />
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">Suspicious Login & Travel Detection</h4>
            </div>
            <label className="sa-toggle cursor-pointer">
              <input type="checkbox" checked={suspiciousTravelAlert} onChange={(e) => setSuspiciousTravelAlert(e.target.checked)} />
              <span className="sa-slider"></span>
            </label>
          </div>
          <p className="text-xs text-slate-400">Analyzes geo-velocity (impossible travel), unrecognized ASN networks, and new device fingerprints. Suspicious sessions trigger immediate step-up auth and email notification.</p>
        </div>
      </div>

      {/* 5. Account Lockout & Recovery Manager Table */}
      <SuperadminSecurityLoginSecurityLockedAccountsTable
        lockedAccounts={lockedAccounts}
        onUnlockAccount={handleUnlockAccount}
        onSendRecoveryLink={handleSendRecoveryLink}
      />

      {/* 6. Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-500/25 motion-safe:transition-all hover:from-amber-500 hover:to-amber-600 active:scale-[0.98] cursor-pointer"
          data-testid="superadmin-login-security-save-rules-button"
        >
          <ShieldCheck size={16} />
          <span>Save Login Security & Rate Limiting Rules</span>
        </button>
      </div>
    </div>
  );
}