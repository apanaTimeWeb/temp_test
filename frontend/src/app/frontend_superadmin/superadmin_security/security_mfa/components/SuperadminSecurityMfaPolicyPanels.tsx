'use client';
/** Responsibility: Superadmin Security Policy Panels; full interactive management of Multi-Factor Authentication (MFA), SuperAdmin enforcement, and recovery codes. */
import { useState } from 'react';
import {
  ShieldCheck, Smartphone, Mail, MessageSquare, Key, ShieldAlert, RefreshCw, Lock,
} from 'lucide-react';
import type { SuperadminSecurityPolicyPanelsProps } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';
import SuperadminSecurityMfaRecoveryModal from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaRecoveryModal';
import SuperadminSecurityMfaAccountsTable from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaAccountsTable';

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
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

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

  if (activeTab !== '2FA & MFA') return null;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl space-y-6 motion-safe:animate-fade-in motion-reduce:animate-none">
      {/* 1. Mandatory SuperAdmin MFA Enforcement Hero */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-card/90 to-card/70 p-4 sm:p-5 shadow-md backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-500/20 text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">SuperAdmin Mandatory MFA Enforcement</h2>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Zero Trust Mandate
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed max-w-xl">
                Mandates multi-factor authentication on every login for all SuperAdmin accounts. Unenrolled accounts are forced to complete TOTP setup before console access.
              </p>
            </div>
          </div>

          <label className="sa-toggle shrink-0 cursor-pointer">
            <input
              id="security-mfa-global-toggle"
              type="checkbox"
              checked={twoFA.enabled}
              onChange={(e) => onToggleMfa?.(e.target.checked)}
              data-testid="superadmin-mfa-global-toggle"
            />
            <span className="sa-slider"></span>
          </label>
        </div>

        {/* Enforcement Toggles */}
        {twoFA.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3.5 mt-3.5 border-t border-emerald-500/20 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <div>
                <p className="font-bold text-slate-100">Enforce SuperAdmin Only</p>
                <p className="text-[10px] text-slate-400">Mandatory for CSO & Root</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.enforceSuperadminsOnly ?? true}
                onChange={(e) => onToggleEnforceSuperadmin?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <div>
                <p className="font-bold text-slate-100">Require Library Admins</p>
                <p className="text-[10px] text-slate-400">7-day onboarding grace</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.requireForAdmins ?? true}
                onChange={(e) => onToggleRequireAdmins?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20">
              <div>
                <p className="font-bold text-slate-100">Step-Up Authentication</p>
                <p className="text-[10px] text-slate-400">Prompts on critical actions</p>
              </div>
              <input
                type="checkbox"
                checked={twoFA.stepUpAuth ?? true}
                onChange={(e) => onToggleStepUp?.(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. Primary Authenticator Method Selection */}
      {twoFA.enabled && (
        <div className="p-4 sm:p-5 border border-indigo-500/20 bg-gradient-to-b from-[#0f143a]/75 to-[#090c24]/90 rounded-2xl shadow-xl backdrop-blur-md space-y-3">
          <div className="border-b border-indigo-500/20 pb-2.5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Smartphone size={16} className="text-indigo-400" />
              <span>Primary Approved Authenticator Methods</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select the primary authentication factor recommended and enforced for SuperAdmins across the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {methods.map(({ value, title, desc, icon: Icon, iconColor, badge, badgeColor }) => {
              const isSelected = twoFA.method === value;
              return (
                <label
                  key={value}
                  onClick={() => onSelectMethod?.(value)}
                  className={`flex flex-col justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-400 bg-gradient-to-b from-indigo-950/70 to-indigo-900/40 shadow-md'
                      : 'border-indigo-500/20 bg-[#07091a]/80 hover:border-indigo-500/40'
                  }`}
                  data-testid={`superadmin-mfa-method-${value}`}
                >
                  <div className="flex items-start justify-between gap-2.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg bg-card/80 border border-border/80 ${iconColor}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-100">{title}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-semibold ${badgeColor}`}>
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
                  <p className="text-[11px] text-slate-300 leading-relaxed">{desc}</p>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Emergency Backup Recovery Codes */}
      <div className="p-4 sm:p-5 border border-amber-500/25 bg-gradient-to-b from-[#1c1208]/85 to-[#0a0710]/95 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400">
              <Lock size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Emergency Break-Glass Recovery Codes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate 10 cryptographically hashed, single-use recovery codes for emergency account restoration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                onGenerateRecoveryCodes?.();
                setShowRecoveryModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 active:scale-95 transition-all cursor-pointer"
              data-testid="superadmin-mfa-generate-codes-button"
            >
              <RefreshCw size={12} />
              <span>Regenerate 10 Codes</span>
            </button>
            <button
              type="button"
              onClick={() => setShowRecoveryModal(true)}
              className="inline-flex items-center rounded-xl border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 active:scale-95 transition-all cursor-pointer"
              data-testid="superadmin-mfa-view-codes-button"
            >
              <span>View Codes</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. SuperAdmin & Privileged Accounts MFA Enrollment Table */}
      <SuperadminSecurityMfaAccountsTable accounts={enrollmentAccounts} />

      {/* 5. Save Button */}
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
      <SuperadminSecurityMfaRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        recoveryCodes={twoFA.recoveryCodes}
      />
    </div>
  );
}
