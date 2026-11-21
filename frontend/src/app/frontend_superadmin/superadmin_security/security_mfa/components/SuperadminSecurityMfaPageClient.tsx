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
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
                <Fingerprint size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                2FA & MFA
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MFA Enforced
              </span>
            </div>
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

      {/* Content */}
      <div
        className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden min-h-[420px] flex flex-col"
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
