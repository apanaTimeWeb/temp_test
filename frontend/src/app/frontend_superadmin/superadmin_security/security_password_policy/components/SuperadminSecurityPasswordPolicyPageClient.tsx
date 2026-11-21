'use client';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_security overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSecurityPasswordPolicyPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_password_policy/schemas/SuperadminSecurityPasswordPolicyPolicySchema';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/types/SuperadminSecurityPasswordPolicyTypes';
import { SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_MFA_PREVIEW, SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/mocks/fixtures/SuperadminSecurityPasswordPolicyPreviewMockFixtures';
import SuperadminSecurityPasswordPolicyPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_password_policy/components/SuperadminSecurityPasswordPolicyPolicyPanels';

import { ShieldAlert, AlertCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityPasswordPolicyUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyUnsavedChangesGuard';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityPasswordPolicyPageClient`.
 * Owns local UI state for password policy rules and preview feedback.
 */
export default function SuperadminSecurityPasswordPolicyPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const [activeTab] = useState("Password Policy");
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityPasswordPolicyPageClient:feedback' });
  };
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityPasswordPolicyPageClient:feedback' });
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
  useSuperadminSecurityPasswordPolicyUnsavedChangesGuard(loginForm.formState.isDirty || passwordForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const [twoFA] = useState(SUPERADMIN_SECURITY_MFA_PREVIEW);

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
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-card via-card/90 to-card/60 p-5 sm:p-6 shadow-sm backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <KeyRound size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                Password Policy
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Policy Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300">
              <CheckCircle2 size={15} className="text-emerald-400" aria-hidden="true" />
              <span>Min 8 Chars</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden min-h-[420px] flex flex-col"
        aria-label="Password Policy Settings"
        tabIndex={0}
      >
        <SuperadminSecurityPasswordPolicyPolicyPanels
          activeTab={activeTab}
          loginRegister={loginForm.register}
          loginErrors={loginForm.formState.errors}
          passwordRegister={passwordForm.register}
          passwordErrors={passwordForm.formState.errors}
          twoFA={twoFA}
          handleSave={handleSave}
        />
      </div>
    </div>
  );
}
