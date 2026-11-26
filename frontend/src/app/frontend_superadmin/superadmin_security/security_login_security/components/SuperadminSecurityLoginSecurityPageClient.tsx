'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_security overview route UI; the module Main remains a thin composition boundary. */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_login_security/schemas/SuperadminSecurityLoginSecurityPolicySchema';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_login_security/types/SuperadminSecurityLoginSecurityTypes';
import { SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_MFA_PREVIEW, SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_security/security_login_security/mocks/fixtures/SuperadminSecurityLoginSecurityPreviewMockFixtures';
import { SUPERADMIN_MFA_ACCOUNTS_PREVIEW } from '@/app/frontend_superadmin/superadmin_security/security_mfa/mocks/fixtures/SuperadminSecurityMfaPreviewMockFixtures';
import type { MfaPolicyState } from '@/app/frontend_superadmin/superadmin_security/security_mfa/types/SuperadminSecurityMfaPolicyPanelsComponentTypes';
import SuperadminSecurityLoginSecurityPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_login_security/components/SuperadminSecurityLoginSecurityPolicyPanels';
import SuperadminSecurityMfaPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaPolicyPanels';
import SuperadminSecurityPasswordPolicyPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_password_policy/components/SuperadminSecurityPasswordPolicyPolicyPanels';

import { ShieldAlert, AlertCircle, Lock, ShieldCheck, Timer, Fingerprint, KeyRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityLoginSecurityUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_login_security/hooks/useSuperadminSecurityLoginSecurityUnsavedChangesGuard';

export default function SuperadminSecurityLoginSecurityPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const [activeTab, setActiveTab] = useState<'Login Security' | '2FA & MFA' | 'Password Policy'>('Login Security');
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityLoginSecurityPageClient:feedback' });
  };

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
  useSuperadminSecurityLoginSecurityUnsavedChangesGuard(loginForm.formState.isDirty || passwordForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const [twoFA, setTwoFA] = useState<MfaPolicyState>({
    ...SUPERADMIN_SECURITY_MFA_PREVIEW,
    enforceSuperadminsOnly: true,
    requireForAdmins: true,
    stepUpAuth: true,
    recoveryCodes: ['E8A1-9B2C-77FA', '33B9-110C-4DAE', '99FE-0012-78BC'],
  });

  const handleSave = () => {
    const reportPreviewOnly = () => showToast(tCopy("COPY.VALIDATION_PASSED_FOR_THIS_LOCAL_PREVIEW_NO_SECURITY_POLICY_WAS_CHANGE_EC57E344"));
    if (activeTab === 'Login Security') {
      void loginForm.handleSubmit(reportPreviewOnly)();
      return;
    }
    if (activeTab === 'Password Policy') {
      void passwordForm.handleSubmit(reportPreviewOnly)();
      return;
    }
    showToast('Validation passed for this local preview. No security policy was changed.');
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
      <div className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/70 via-[#18110b] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-inner">
                <Lock size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Login Security & Authentication Controls
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 motion-safe:animate-pulse" />
                Protection Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Multi-tier login defenses, progressive credential delay algorithms, and suspicious login lockout policies across administrative tiers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300">
              <ShieldCheck size={15} className="text-emerald-400" aria-hidden="true" />
              <span>Max 5 Retries Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241306]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Brute-Force Shield</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-inner">
              <Lock size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tabular-nums">Enforcing</div>
          <div className="text-[11px] text-slate-400 mt-1">Progressive IP delay active</div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lockout Threshold</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tabular-nums">5 Retries</div>
          <div className="text-[11px] text-slate-400 mt-1">30-min auto account lockout</div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0e1338]/90 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-indigo-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session Inactivity</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
              <Timer size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-indigo-300 tabular-nums">15 Mins</div>
          <div className="text-[11px] text-slate-400 mt-1">Idle token invalidation</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 motion-safe:transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SuperAdmin MFA</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">Mandatory</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero-Trust privileged access</div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-indigo-500/20 bg-[#080b20]/90 p-2.5 rounded-2xl overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('Login Security')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold motion-safe:transition-all cursor-pointer ${
            activeTab === 'Login Security'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <ShieldAlert size={14} />
          <span>Login Security & Rate Limiting</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('2FA & MFA')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold motion-safe:transition-all cursor-pointer ${
            activeTab === '2FA & MFA'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <Fingerprint size={14} />
          <span>Mandatory MFA & Authenticator</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('Password Policy')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold motion-safe:transition-all cursor-pointer ${
            activeTab === 'Password Policy'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
          }`}
        >
          <KeyRound size={14} />
          <span>Password & Modern Hashing Policy</span>
        </button>
      </div>

      {/* Content Card */}
      <div
        className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl overflow-hidden backdrop-blur-xl min-h-[420px] flex flex-col"
        aria-label="Login Security Settings"
        tabIndex={0}
      >
        {activeTab === 'Login Security' && (
          <SuperadminSecurityLoginSecurityPolicyPanels
            activeTab={activeTab}
            loginRegister={loginForm.register}
            loginErrors={loginForm.formState.errors}
            passwordRegister={passwordForm.register}
            passwordErrors={passwordForm.formState.errors}
            twoFA={twoFA}
            handleSave={handleSave}
          />
        )}
        {activeTab === '2FA & MFA' && (
          <SuperadminSecurityMfaPolicyPanels
            activeTab={activeTab}
            loginRegister={loginForm.register}
            loginErrors={loginForm.formState.errors}
            passwordRegister={passwordForm.register}
            passwordErrors={passwordForm.formState.errors}
            twoFA={twoFA}
            onToggleMfa={(enabled) => setTwoFA((p) => ({ ...p, enabled }))}
            onSelectMethod={(method) => setTwoFA((p) => ({ ...p, method }))}
            onToggleEnforceSuperadmin={(enforceSuperadminsOnly) => setTwoFA((p) => ({ ...p, enforceSuperadminsOnly }))}
            onToggleRequireAdmins={(requireForAdmins) => setTwoFA((p) => ({ ...p, requireForAdmins }))}
            onToggleStepUp={(stepUpAuth) => setTwoFA((p) => ({ ...p, stepUpAuth }))}
            onGenerateRecoveryCodes={() => {
              setTwoFA((p) => ({ ...p, recoveryCodes: ['RC-11A', 'RC-22B', 'RC-33C', 'RC-44D', 'RC-55E', 'RC-66F', 'RC-77G', 'RC-88H', 'RC-99J', 'RC-00K'] }));
              toast.success('Generated fresh recovery codes');
            }}
            enrollmentAccounts={SUPERADMIN_MFA_ACCOUNTS_PREVIEW}
            handleSave={handleSave}
          />
        )}
        {activeTab === 'Password Policy' && (
          <SuperadminSecurityPasswordPolicyPolicyPanels
            activeTab={activeTab}
            loginRegister={loginForm.register}
            loginErrors={loginForm.formState.errors}
            passwordRegister={passwordForm.register}
            passwordErrors={passwordForm.formState.errors}
            twoFA={twoFA}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}