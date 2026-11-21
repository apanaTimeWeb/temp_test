'use client';
/** Responsibility: Superadmin Security Policy Panels; full interactive management of Multi-Factor Authentication (MFA), SuperAdmin enforcement, and recovery codes. */
/** Data-Flow: props/hook state -> SuperadminSecurityMfaPolicyPanels formatting/interaction -> module API/handler boundary. */
import { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  Key,
  ShieldAlert,
  Download,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';
import { toast } from 'sonner';

/**
 * Renders the full interactive 2FA & MFA policy configuration and enrollment manager for SuperAdmin.
 */
export default function SuperadminSecurityMfaPolicyPanels({
  activeTab,
  twoFA,
  onToggleMfa,
  onSelectMethod,
  onToggleEnforceSuperadmin,
  onToggleRequireAdmins,
  onToggleStepUp,
  onGenerateRecoveryCodes,
  enrollmentAccounts = [],
  handleSave,
}: SuperadminSecurityPolicyPanelsProps) {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [accountSearch, setAccountSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'SuperAdmin' | 'Admin'>('All');

  const methods = [
    {
      value: 'Authenticator App (Google/Authy)',
      title: 'Authenticator App (TOTP)',
      desc: 'Google Authenticator, Authy, 1Password. 6-digit rolling code (Recommended)',
      icon: Smartphone,
      iconColor: 'text-indigo-400',
      badge: 'Most Secure',
      badgeColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    },
    {
      value: 'Hardware Security Key (FIDO2/WebAuthn)',
      title: 'FIDO2 / WebAuthn Hardware Key',
      desc: 'YubiKey, Apple Touch ID, Windows Hello physical hardware token',
      icon: Key,
      iconColor: 'text-cyan-400',
      badge: 'Phishing-Proof',
      badgeColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    },
    {
      value: 'Email OTP',
      title: 'Email One-Time Password',
      desc: '6-digit verification code sent to verified registered primary email address',
      icon: Mail,
      iconColor: 'text-sky-400',
      badge: 'Fallback',
      badgeColor: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    },
    {
      value: 'SMS OTP',
      title: 'SMS One-Time Password',
      desc: 'SMS text message sent via telephony provider (+91 / +1 / International)',
      icon: MessageSquare,
      iconColor: 'text-amber-400',
      badge: 'Convenient',
      badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    },
  ] as const;

  const filteredAccounts = enrollmentAccounts.filter((acc) => {
    const matchesRole = roleFilter === 'All' || acc.role === roleFilter;
    const matchesSearch =
      acc.name.toLowerCase().includes(accountSearch.toLowerCase()) ||
      acc.email.toLowerCase().includes(accountSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleCopyCodes = () => {
    if (!twoFA.recoveryCodes?.length) return;
    const text = twoFA.recoveryCodes.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedCodes(true);
    toast.success('10 Recovery codes copied to clipboard', { id: 'mfa-copy-codes' });
    setTimeout(() => setCopiedCodes(false), 2500);
  };

  const handleDownloadCodes = () => {
    if (!twoFA.recoveryCodes?.length) return;
    const content = `SUPERADMIN EMERGENCY RECOVERY CODES\nGenerated: ${new Date().toISOString()}\nAccount: CSO / Emergency Operations\n\n${twoFA.recoveryCodes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nWARNING: Store these codes in a secure vault. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superadmin-recovery-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Emergency recovery codes downloaded securely', { id: 'mfa-download-codes' });
  };

  if (activeTab !== '2FA & MFA') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl space-y-8 motion-safe:animate-fade-in motion-reduce:animate-none">
      {/* 1. Mandatory SuperAdmin MFA Enforcement Hero */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card/90 to-card/70 p-5 sm:p-6 shadow-md backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400 shadow-inner">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-bold text-slate-100">
                  SuperAdmin Mandatory MFA Enforcement
                </h2>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                  Zero Trust Mandate
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed max-w-xl">
                Mandates multi-factor authentication on every login for all SuperAdmin and privileged accounts.
                Unenrolled accounts are forced to complete TOTP setup before accessing administrative consoles.
              </p>
            </div>
          </div>

          <label className="sa-toggle cursor-pointer shrink-0">
            <input
              id="security-mfa-enabled"
              type="checkbox"
              checked={twoFA.enabled}
              onChange={(e) => onToggleMfa?.(e.target.checked)}
              aria-label="Toggle SuperAdmin Mandatory MFA"
              data-testid="superadmin-mfa-toggle-master"
            />
            <span className="sa-slider"></span>
          </label>
        </div>

        {/* Sub-policies */}
        {twoFA.enabled && (
          <div className="mt-6 pt-5 border-t border-border/80 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card/60">
              <div>
                <p className="text-xs font-bold text-slate-200">Enforce on All SuperAdmins</p>
                <p className="text-[11px] text-slate-400">Lockout if not configured</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.enforceSuperadminsOnly ?? true}
                onChange={(e) => onToggleEnforceSuperadmin?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                data-testid="superadmin-mfa-enforce-superadmin-checkbox"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card/60">
              <div>
                <p className="text-xs font-bold text-slate-200">Require for Library Admins</p>
                <p className="text-[11px] text-slate-400">7-day grace period on onboarding</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.requireForAdmins ?? true}
                onChange={(e) => onToggleRequireAdmins?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                data-testid="superadmin-mfa-require-admins-checkbox"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card/60">
              <div>
                <p className="text-xs font-bold text-slate-200">Step-Up Auth on Critical Actions</p>
                <p className="text-[11px] text-slate-400">Re-verify MFA before deletes/exports</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.stepUpAuth ?? true}
                onChange={(e) => onToggleStepUp?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
                data-testid="superadmin-mfa-stepup-auth-checkbox"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Authenticator Method Selection */}
      {twoFA.enabled && (
        <div className="p-5 sm:p-6 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md space-y-4">
          <div className="border-b border-border/80 pb-3">
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <Smartphone size={18} className="text-indigo-400" />
              <span>Primary Approved Authenticator Methods</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select the primary authentication factor recommended and enforced for SuperAdmins across the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            {methods.map(({ value, title, desc, icon: Icon, iconColor, badge, badgeColor }) => {
              const isSelected = twoFA.method === value;
              return (
                <label
                  key={value}
                  onClick={() => onSelectMethod?.(value)}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500/60 bg-indigo-500/15 shadow-sm'
                      : 'border-border/80 bg-card/40 hover:border-indigo-500/30 hover:bg-card/70'
                  }`}
                  data-testid={`superadmin-mfa-method-${value}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg bg-card/80 border border-border/80 ${iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-100">{title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="mfa-primary-method"
                      value={value}
                      checked={isSelected}
                      onChange={() => onSelectMethod?.(value)}
                      className="accent-indigo-500 mt-1"
                    />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">{desc}</p>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Emergency Backup Recovery Codes */}
      <div className="p-5 sm:p-6 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100">
                Emergency Break-Glass Recovery Codes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate 10 cryptographically hashed, single-use recovery codes for emergency break-glass account restoration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                onGenerateRecoveryCodes?.();
                setShowRecoveryModal(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              data-testid="superadmin-mfa-generate-codes-button"
            >
              <RefreshCw size={14} />
              <span>Regenerate 10 Codes</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white active:scale-[0.98] transition-all cursor-pointer shadow-xs"
              data-testid="superadmin-mfa-view-codes-button"
            >
              <span>View Codes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. SuperAdmin & Privileged Accounts MFA Enrollment Table */}
      <div className="p-5 sm:p-6 bg-card/70 border border-border/80 rounded-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-400" />
              <span>Administrator MFA Enrollment & Compliance Status</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live status of SuperAdmin break-glass accounts, operations leads, and tenant administrators.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="search"
                value={accountSearch}
                onChange={(e) => setAccountSearch(e.target.value)}
                placeholder="Search admin name/email..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-card border border-border/80 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'All' | 'SuperAdmin' | 'Admin')}
              className="px-2.5 py-1.5 text-xs rounded-xl bg-card border border-border/80 text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Roles</option>
              <option value="SuperAdmin">SuperAdmin</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-card/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-border/70">
              <tr>
                <th className="py-2.5 px-3">Administrator Account</th>
                <th className="py-2.5 px-3">Role Scope</th>
                <th className="py-2.5 px-3">MFA Method</th>
                <th className="py-2.5 px-3">Enrolled At</th>
                <th className="py-2.5 px-3">Last Verified</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-mono">
              {filteredAccounts.map((acc) => {
                const isSuper = acc.role === 'SuperAdmin';
                const isEnforced = acc.status === 'Enforced';
                return (
                  <tr key={acc.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3 px-3 font-sans">
                      <p className="font-bold text-slate-100">{acc.name}</p>
                      <p className="text-[11px] text-slate-400">{acc.email}</p>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSuper
                            ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                            : 'bg-indigo-500/15 border border-indigo-500/30 text-indigo-300'
                        }`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-200">{acc.method}</td>
                    <td className="py-3 px-3 text-slate-400">{acc.enrolledAt}</td>
                    <td className="py-3 px-3 text-slate-300 font-sans">{acc.lastVerified}</td>
                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isEnforced
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25'
                            : acc.status === 'Active'
                            ? 'bg-sky-500/10 text-sky-300 border border-sky-500/25'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/25'
                        }`}
                      >
                        {isEnforced ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        type="button"
                        onClick={() => toast.info(`MFA challenge verification sent to ${acc.email}`, { id: `mfa-test-${acc.id}` })}
                        className="px-2.5 py-1 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-[11px] font-semibold text-indigo-300 hover:text-white active:scale-95 transition-all cursor-pointer shadow-xs"
                      >
                        Test Auth
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-500 hover:to-teal-600 active:scale-[0.98] cursor-pointer"
          data-testid="superadmin-mfa-save-policy-button"
        >
          <ShieldCheck size={16} />
          <span>Save MFA Enforcement Rules</span>
        </button>
      </div>

      {/* Recovery Codes Modal Dialog */}
      {showRecoveryModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recovery-codes-title"
        >
          <div className="w-full max-w-lg rounded-2xl border border-amber-500/30 bg-[#0a0d24] p-6 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-start justify-between border-b border-border/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 id="recovery-codes-title" className="text-base font-bold text-slate-100">
                    Emergency Backup Recovery Codes
                  </h3>
                  <p className="text-xs text-slate-400">Single-use cryptographically sealed tokens</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="text-slate-400 hover:text-white text-base font-bold p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close recovery codes modal"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <p>
                Treat these recovery codes like physical keys. Store them in an offline password manager or physical vault.
                If you lose access to your primary authenticator, these are the ONLY way to regain access to your SuperAdmin account.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-4 rounded-xl bg-black/50 border border-border/80 font-mono text-xs text-emerald-400">
              {(twoFA.recoveryCodes || []).map((code, idx) => (
                <div key={code} className="flex items-center justify-between p-2 rounded bg-card/60 border border-border/60">
                  <span className="text-slate-500">{idx + 1}.</span>
                  <span className="font-bold tracking-wider">{code}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCodes}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  {copiedCodes ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedCodes ? 'Copied!' : 'Copy All'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCodes}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-200 active:scale-[0.98] transition-all cursor-pointer shadow-xs"
                >
                  <Download size={14} />
                  <span>Download .txt</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-xs font-bold text-white shadow-md shadow-indigo-600/25 active:scale-[0.98] transition-all cursor-pointer"
              >
                I Have Stored Them Safely
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
