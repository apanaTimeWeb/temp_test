'use client';
// RESPONSIBILITY: Renders the Global Password, Multi-Factor Authentication (MFA), and Session Policies configuration card.
// DATA FLOW: RHF context -> SuperadminSettingsGeneralSecurityPoliciesCard -> user input -> form state
import type { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { ShieldCheck, Lock, KeyRound, Timer, ShieldAlert, Check } from 'lucide-react';
import type { SuperadminSettingsFormValues } from '@/app/frontend_superadmin/superadmin_settings/settings_general/types/SuperadminSettingsGeneralTypes';
import { MFA_ENFORCEMENT_OPTIONS } from '@/app/frontend_superadmin/superadmin_settings/settings_general/constants/SuperadminSettingsGeneralConstants';

export const SuperadminSettingsGeneralSecurityPoliciesCard: FC = () => {
  const { register, watch, formState: { errors } } = useFormContext<SuperadminSettingsFormValues>();

  const requireUpper = watch('securityPolicy.requireUppercase');
  const requireNum = watch('securityPolicy.requireNumbers');
  const requireSpecial = watch('securityPolicy.requireSpecialChars');

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">3. Password & MFA Security Policies</h2>
            <p className="text-xs text-secondary">Global authentication rules, password complexity thresholds, and MFA enforcement.</p>
          </div>
        </div>
        <span className="rounded-full bg-purple-500/15 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-300">
          Zero Trust
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password Complexity Checklist & Min Length */}
        <div className="space-y-4 rounded-xl border border-border bg-surface-zebra p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Lock size={14} className="text-primary" /> Password Complexity Rules
            </span>
            <span className="text-[11px] font-medium text-secondary">Enterprise Baseline</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-min-password-length" className="text-xs font-semibold text-secondary">
              Minimum Password Length (Characters)
            </label>
            <input
              id="settings-min-password-length"
              type="number"
              min={8}
              max={32}
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
              {...register('securityPolicy.minPasswordLength', { valueAsNumber: true })}
              data-testid="superadmin-settings-min-password-input"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-border accent-primary"
                {...register('securityPolicy.requireUppercase')}
                data-testid="superadmin-settings-require-uppercase-checkbox"
              />
              <span>Require at least one uppercase letter (A-Z)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-border accent-primary"
                {...register('securityPolicy.requireNumbers')}
                data-testid="superadmin-settings-require-numbers-checkbox"
              />
              <span>Require at least one numeric digit (0-9)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded-md border-border accent-primary"
                {...register('securityPolicy.requireSpecialChars')}
                data-testid="superadmin-settings-require-special-checkbox"
              />
              <span>Require at least one special character (!@#$%^&*)</span>
            </label>
          </div>

          <div className="space-y-1.5 pt-2">
            <label htmlFor="settings-password-expiry" className="text-xs font-semibold text-secondary">
              Forced Password Expiry (Days)
            </label>
            <select
              id="settings-password-expiry"
              className="w-full rounded-xl border border-border bg-input px-3 py-2 text-xs text-foreground"
              {...register('securityPolicy.passwordExpiryDays', { valueAsNumber: true })}
              data-testid="superadmin-settings-password-expiry-select"
            >
              <option value={0}>Never Expire (Not Recommended)</option>
              <option value={30}>Every 30 Days (High Security)</option>
              <option value={60}>Every 60 Days</option>
              <option value={90}>Every 90 Days (Industry Standard)</option>
              <option value={180}>Every 180 Days (Half Year)</option>
            </select>
          </div>
        </div>

        {/* MFA & Session Lockdown */}
        <div className="space-y-4 rounded-xl border border-border bg-surface-zebra p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <KeyRound size={14} className="text-purple-400" /> Multi-Factor Authentication (MFA)
            </span>
            <span className="text-[11px] font-medium text-purple-400">TOTP / Authenticator</span>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="settings-mfa-enforcement" className="text-xs font-semibold text-secondary">
              MFA Enforcement Level
            </label>
            <select
              id="settings-mfa-enforcement"
              className="w-full rounded-xl border border-border bg-input px-3.5 py-2.5 text-sm text-foreground focus:border-focus focus:outline-hidden focus:ring-1 focus:ring-focus"
              {...register('securityPolicy.mfaEnforcement')}
              data-testid="superadmin-settings-mfa-enforcement-select"
            >
              {MFA_ENFORCEMENT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label htmlFor="settings-session-timeout" className="flex items-center gap-1 text-xs font-semibold text-secondary">
                <Timer size={12} className="text-primary" /> Session Inactivity Timeout
              </label>
              <select
                id="settings-session-timeout"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground"
                {...register('securityPolicy.sessionTimeoutMinutes', { valueAsNumber: true })}
                data-testid="superadmin-settings-session-timeout-select"
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes (Recommended)</option>
                <option value={60}>60 Minutes (1 Hour)</option>
                <option value={120}>120 Minutes (2 Hours)</option>
                <option value={240}>240 Minutes (4 Hours)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="settings-max-failed-logins" className="flex items-center gap-1 text-xs font-semibold text-secondary">
                <ShieldAlert size={12} className="text-danger" /> Max Failed Login Lockout
              </label>
              <select
                id="settings-max-failed-logins"
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-xs text-foreground"
                {...register('securityPolicy.maxFailedLogins', { valueAsNumber: true })}
                data-testid="superadmin-settings-max-failed-logins-select"
              >
                <option value={3}>3 Attempts (Strict)</option>
                <option value={5}>5 Attempts (Standard)</option>
                <option value={10}>10 Attempts (Lenient)</option>
              </select>
            </div>
          </div>

          <div className="rounded-lg bg-surface-highlight border border-border p-3 text-[11px] text-secondary leading-relaxed">
            <span className="font-bold text-foreground">Audit Notice: </span>
            Superadmin sessions are audited continuously. Failed attempts are recorded in the central immutable audit log.
          </div>
        </div>
      </div>
    </div>
  );
};
