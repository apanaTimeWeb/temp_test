'use client';
// RESPONSIBILITY: Renders the Global Password, Multi-Factor Authentication (MFA), and Session Policies configuration card.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralSecurityPoliciesCard -> user input -> form state
import type { FC } from 'react';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck, Lock, KeyRound, Timer, ShieldAlert, ExternalLink } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { MFA_ENFORCEMENT_OPTIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export const SuperadminSettingsGeneralSecurityPoliciesCard: FC = () => {
  const { register } = useFormContext<SuperadminSettingsFormValues>();

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-[#0c102b]/95 via-[#090d24]/95 to-[#050714]/95 backdrop-blur-md shadow-xl shadow-black/40 p-6 space-y-6 hover:border-indigo-500/35 transition-all">
      <div className="flex items-center justify-between border-b border-indigo-500/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">3. Password & MFA Security Policies</h2>
            <p className="text-xs text-slate-400">Global authentication rules, password complexity thresholds, and MFA enforcement.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/superadmin/superadmin_security/security_password_policy"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all shadow-xs cursor-pointer no-underline"
          >
            <span>Open Security Module 09</span>
            <ExternalLink size={12} />
          </Link>
          <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
            Zero Trust
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Complexity Checklist & Min Length */}
        <div className="space-y-4 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Lock size={14} className="text-purple-400" /> Password Complexity Rules
            </span>
            <span className="text-[11px] font-medium text-purple-300">Enterprise Baseline</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-min-password-length" className="text-xs font-semibold text-slate-300">
              Minimum Password Length (Characters)
            </label>
            <input
              id="settings-min-password-length"
              type="number"
              min={8}
              max={32}
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('securityPolicy.minPasswordLength', { valueAsNumber: true })}
              data-testid="superadmin-settings-min-password-input"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-purple-500 accent-purple-500 focus:ring-purple-500/30 cursor-pointer"
                {...register('securityPolicy.requireUppercase')}
                data-testid="superadmin-settings-require-uppercase-checkbox"
              />
              <span>Require at least one uppercase letter (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-purple-500 accent-purple-500 focus:ring-purple-500/30 cursor-pointer"
                {...register('securityPolicy.requireNumbers')}
                data-testid="superadmin-settings-require-numbers-checkbox"
              />
              <span>Require at least one numeric digit (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-slate-100 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-indigo-500/40 bg-slate-950 text-purple-500 accent-purple-500 focus:ring-purple-500/30 cursor-pointer"
                {...register('securityPolicy.requireSpecialChars')}
                data-testid="superadmin-settings-require-special-checkbox"
              />
              <span>Require at least one special character (!@#$%^&*)</span>
            </label>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="settings-password-expiry" className="text-xs font-semibold text-slate-300">
              Forced Password Expiry (Days)
            </label>
            <select
              id="settings-password-expiry"
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('securityPolicy.passwordExpiryDays', { valueAsNumber: true })}
              data-testid="superadmin-settings-password-expiry-select"
            >
              <option value={0} className="bg-slate-950 text-slate-100">Never Expire (Not Recommended)</option>
              <option value={30} className="bg-slate-950 text-slate-100">Every 30 Days (High Security)</option>
              <option value={60} className="bg-slate-950 text-slate-100">Every 60 Days</option>
              <option value={90} className="bg-slate-950 text-slate-100">Every 90 Days (Industry Standard)</option>
              <option value={180} className="bg-slate-950 text-slate-100">Every 180 Days (Half Year)</option>
            </select>
          </div>
        </div>

        {/* MFA & Session Lockdown */}
        <div className="space-y-4 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <KeyRound size={14} className="text-purple-400" /> Multi-Factor Authentication (MFA)
            </span>
            <span className="text-[11px] font-medium text-purple-300">TOTP / Authenticator</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-mfa-enforcement" className="text-xs font-semibold text-slate-300">
              MFA Enforcement Level
            </label>
            <select
              id="settings-mfa-enforcement"
              className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              {...register('securityPolicy.mfaEnforcement')}
              data-testid="superadmin-settings-mfa-enforcement-select"
            >
              {MFA_ENFORCEMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-950 text-slate-100">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="settings-session-timeout" className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                <Timer size={12} className="text-indigo-400" /> Session Inactivity Timeout
              </label>
              <select
                id="settings-session-timeout"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                {...register('securityPolicy.sessionTimeoutMinutes', { valueAsNumber: true })}
                data-testid="superadmin-settings-session-timeout-select"
              >
                <option value={15} className="bg-slate-950 text-slate-100">15 Minutes</option>
                <option value={30} className="bg-slate-950 text-slate-100">30 Minutes (Recommended)</option>
                <option value={60} className="bg-slate-950 text-slate-100">60 Minutes (1 Hour)</option>
                <option value={120} className="bg-slate-950 text-slate-100">120 Minutes (2 Hours)</option>
                <option value={240} className="bg-slate-950 text-slate-100">240 Minutes (4 Hours)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-max-failed-logins" className="flex items-center gap-1 text-xs font-semibold text-slate-300">
                <ShieldAlert size={12} className="text-rose-400" /> Max Failed Login Lockout
              </label>
              <select
                id="settings-max-failed-logins"
                className="w-full rounded-xl border border-indigo-500/25 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                {...register('securityPolicy.maxFailedLogins', { valueAsNumber: true })}
                data-testid="superadmin-settings-max-failed-logins-select"
              >
                <option value={3} className="bg-slate-950 text-slate-100">3 Attempts (Strict)</option>
                <option value={5} className="bg-slate-950 text-slate-100">5 Attempts (Standard)</option>
                <option value={10} className="bg-slate-950 text-slate-100">10 Attempts (Lenient)</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-indigo-500/10 border border-indigo-500/25 p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-bold text-slate-200">Audit Notice: </span>
            Superadmin sessions are audited continuously. Failed attempts are recorded in the central immutable audit log.
          </div>
        </div>
      </div>
    </div>
  );
};
