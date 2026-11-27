'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_security overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSecurityMfaPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_mfa/schemas/SuperadminSecurityMfaPolicySchema';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaTypes';
import {
  SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS,
  SUPERADMIN_SECURITY_MFA_PREVIEW,
  SUPERADMIN_MFA_ACCOUNTS_PREVIEW,
  SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS,
} from '@/app/frontend_superadmin/superadmin_security/security_mfa/mocks/fixtures/SuperadminSecurityMfaPreviewMockFixtures';
import SuperadminSecurityMfaPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaPolicyPanels';
import type { MfaPolicyState, MfaEnrollmentAccount } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';

import { ShieldAlert, AlertCircle, Fingerprint, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityMfaUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_mfa/hooks/useSuperadminSecurityMfaUnsavedChangesGuard';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityMfaPageClient`.
 * Owns interactive local state for MFA policy, enforcement rules, recovery codes, and enrollment management.
 */
export default function SuperadminSecurityMfaPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const [activeTab] = useState("2FA & MFA");
  const [twoFA, setTwoFA] = useState<MfaPolicyState>(SUPERADMIN_SECURITY_MFA_PREVIEW);
  const [enrollmentAccounts] = useState<MfaEnrollmentAccount[]>(SUPERADMIN_MFA_ACCOUNTS_PREVIEW);

  const loginForm = useForm<SuperadminSecurityLoginRules>({
    resolver: zodResolver(SUPERADMIN_SECURITY_LOGIN_SCHEMA),
    defaultValues: SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS,
    mode: 'onChange',
  });
  const passwordForm = useForm<SuperadminSecurityPasswordPolicy>({
    resolver: zodResolver(SUPERADMIN_SECURITY_PASSWORD_SCHEMA),
    defaultValues: SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS,
    mode: 'onChange',
  });
  useSuperadminSecurityMfaUnsavedChangesGuard(loginForm.formState.isDirty || passwordForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));

  const handleToggleMfa = (enabled: boolean) => {
    setTwoFA((prev) => ({ ...prev, enabled }));
    toast.success(
      enabled
        ? 'SuperAdmin Mandatory MFA enabled. All privileged sessions will be prompted on next login.'
        : 'SuperAdmin MFA disabled (Warning: Security Posture Reduced)',
      { id: 'mfa-toggle-toast' }
    );
  };

  const handleSelectMethod = (method: string) => {
    setTwoFA((prev) => ({ ...prev, method }));
    toast.info(`Primary authenticator method set to: ${method}`, { id: 'mfa-method-toast' });
  };

  const handleToggleEnforceSuperadmin = (enforceSuperadminsOnly: boolean) => {
    setTwoFA((prev) => ({ ...prev, enforceSuperadminsOnly }));
    toast.info(
      enforceSuperadminsOnly
        ? 'MFA strictly enforced for all SuperAdmins'
        : 'SuperAdmin-only enforcement relaxed',
      { id: 'mfa-enforce-sa-toast' }
    );
  };

  const handleToggleRequireAdmins = (requireForAdmins: boolean) => {
    setTwoFA((prev) => ({ ...prev, requireForAdmins }));
    toast.info(
      requireForAdmins
        ? 'MFA requirement extended to Library Admins (7-day onboarding grace period)'
        : 'Library Admin MFA requirement optional',
      { id: 'mfa-req-adm-toast' }
    );
  };

  const handleToggleStepUp = (stepUpAuth: boolean) => {
    setTwoFA((prev) => ({ ...prev, stepUpAuth }));
    toast.info(
      stepUpAuth
        ? 'Step-Up Authentication enabled for destructive & critical mutations'
        : 'Step-Up Authentication disabled',
      { id: 'mfa-stepup-toast' }
    );
  };

  const handleGenerateRecoveryCodes = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const generateSegment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const newCodes = Array.from({ length: 10 }, () => `${generateSegment()}-${generateSegment()}-${generateSegment()}`);
    setTwoFA((prev) => ({ ...prev, recoveryCodes: newCodes, recoveryCodesGenerated: true }));
    toast.success('10 Fresh emergency recovery codes generated successfully', { id: 'mfa-gen-codes' });
  };

  const handleSave = () => {
    toast.success('Multi-Factor Authentication policy rules successfully saved and active.', {
      id: 'mfa-save-success',
    });
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {tCopy("COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS")}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/70 via-[#061814] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
                <Fingerprint size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Multi-Factor Authentication (MFA / 2FA)
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                MFA Enforced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              FIPS 140-2 Level 2 compliant Time-based One-Time Password (TOTP) enforcement, biometric passkeys, and break-glass emergency keys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300">
              <ShieldCheck size={15} className="text-emerald-400" aria-hidden="true" />
              <span>TOTP Authenticator</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SuperAdmin MFA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
              <Fingerprint size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">Mandatory</div>
          <div className="text-[11px] text-slate-400 mt-1">100% privileged coverage</div>
        </div>

        <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-b from-[#081c2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-sky-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Library Admin Policy</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/15 text-sky-400 shadow-inner">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-sky-400 tabular-nums">Active</div>
          <div className="text-[11px] text-slate-400 mt-1">7-day grace on onboarding</div>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1b0d2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-purple-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Step-Up Auth</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">Required</div>
          <div className="text-[11px] text-slate-400 mt-1">Guards destructive mutations</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241306]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Break-Glass Codes</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-inner">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tabular-nums">10 Keys</div>
          <div className="text-[11px] text-slate-400 mt-1">Single-use emergency codes</div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl overflow-hidden backdrop-blur-xl min-h-[420px] flex flex-col"
        aria-label="2FA and MFA Settings"
        tabIndex={0}
      >
        <SuperadminSecurityMfaPolicyPanels
          activeTab={activeTab}
          loginRegister={loginForm.register}
          loginErrors={loginForm.formState.errors}
          passwordRegister={passwordForm.register}
          passwordErrors={passwordForm.formState.errors}
          twoFA={twoFA}
          onToggleMfa={handleToggleMfa}
          onSelectMethod={handleSelectMethod}
          onToggleEnforceSuperadmin={handleToggleEnforceSuperadmin}
          onToggleRequireAdmins={handleToggleRequireAdmins}
          onToggleStepUp={handleToggleStepUp}
          onGenerateRecoveryCodes={handleGenerateRecoveryCodes}
          enrollmentAccounts={enrollmentAccounts}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}
