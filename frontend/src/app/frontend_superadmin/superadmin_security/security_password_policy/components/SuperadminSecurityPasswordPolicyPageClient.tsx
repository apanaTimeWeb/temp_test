'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/config/superadmin_security_password_policy.url_config.ts';
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
import { SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_MFA_PREVIEW, SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_FAILED_LOGINS, SUPERADMIN_SECURITY_SESSIONS, SUPERADMIN_SECURITY_API_KEYS, SUPERADMIN_SECURITY_IP_RULES } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/mocks/fixtures/SuperadminSecurityPasswordPolicyPreviewMockFixtures';
import SuperadminSecurityPasswordPolicyPolicyPanels from '@/app/frontend_superadmin/superadmin_security/security_password_policy/components/SuperadminSecurityPasswordPolicyPolicyPanels';

import { ShieldAlert, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityPasswordPolicyUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/hooks/useSuperadminSecurityPasswordPolicyUnsavedChangesGuard';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/constants/SuperadminSecurityPasswordPolicyConstants';
import { SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS } from '@/app/frontend_superadmin/superadmin_security/security_password_policy/constants/SuperadminSecurityPasswordPolicyStaticConstants';
/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityPasswordPolicyPageClient`.
 * Owns local UI state for `activeTab` and `newIp`; preview feedback uses deduplicated Sonner messages.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityPasswordPolicyPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  
  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
    "Login Security": SUPERADMIN_NAVIGATION_ROUTES.security_login_security,
    "Password Policy": SUPERADMIN_NAVIGATION_ROUTES.security_password_policy,
    "2FA & MFA": SUPERADMIN_NAVIGATION_ROUTES.security_mfa,
    "IP Firewall": SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall,
    "API Keys": SUPERADMIN_NAVIGATION_ROUTES.security_api_keys,
    "Active Sessions": SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions,
    "Audit & Threats": SUPERADMIN_NAVIGATION_ROUTES.security_threats
    };
    const route = routes[key];
    if (route) { const target = new URL(route, window.location.origin); const query = new URLSearchParams(window.location.search); query.delete('view'); query.forEach((value, key) => { if (!target.searchParams.has(key)) target.searchParams.append(key, value); }); window.location.assign(target.pathname + target.search + target.hash); }
  };
const [activeTab] = useState("Password Policy");
  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityPasswordPolicyPageClient:feedback' }); };

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
  const [newIp, setNewIp] = useState('');
  
  
  
  

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
    showToast(tCopy('COPY.SECURITY_TAB_READ_ONLY_NO_API', { tab: tCopy(SUPERADMIN_SECURITY_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_LOGIN_SECURITY') }));
  };

  const handleExportLogs = () => {
    
    const cell = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [
      [tCopy('COPY.SAMPLE_SECURITY_LOG_CLASSIFICATION'), ...Array(SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.length - 1).fill('')].map(cell).join(','),
      SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.map(cell).join(','),
      ...SUPERADMIN_SECURITY_FAILED_LOGINS.map((row) => SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS.map((field) => cell(row[field])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'superadmin_sample_security_logs_preview.csv';
    anchor.click();
    URL.revokeObjectURL(url);
    showToast(tCopy("COPY.DOWNLOADED_A_SAMPLE_SECURITY_LOG_PREVIEW_ONLY_NO_LIVE_AUDIT_DATA_WAS_EXPORTED"));
  };

  const handleForceLogout = (id: number) => {
    showToast(tCopy("COPY.SESSION_TERMINATION_UNAVAILABLE", { id }));
  };

  const handleAddIp = () => {
    if(!newIp) return;
    showToast(tCopy("COPY.UNAVAILABLE_NO_FIREWALL_API_CONTRACT_IS_SUPPLIED_THE_IP_RULE_WAS_NOT_APPLIED"));
  };

  

  return (
    <div className="sa-page-animate relative pb-10">
      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{tCopy("COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS")}</p>

      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb">
          <span>{tCopy("COPY.LIBRARY_OS")}</span><span>/</span><span>{tCopy("COPY.SUPER_ADMIN")}</span><span>/</span><span>{tCopy("COPY.SECURITY_CENTER")}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <h1 className="sa-page-title flex items-center gap-3">
            <ShieldAlert className="text-danger drop-shadow-card" size={28} /> {tCopy("COPY.SECURITY_CENTER")}
          </h1>
          <span className="bg-danger-bg text-danger border border-border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
            <AlertCircle size={14} /> {tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy("COPY.SECURITY_CENTER_SECTIONS")}>
        {SUPERADMIN_SECURITY_TABS.map((tab) => (
          <button type="button"
            key={tab.name}
            id={`security-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.name 
                ? 'bg-danger-bg text-primary border border-border shadow-card' 
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
           data-testid={`superadmin-security-security-overview-set-active-tab-1-${String(tab.name)}`}>
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="sa-card p-0 h-150 flex flex-col overflow-hidden border-border"  aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SECURITY_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_LOGIN_SECURITY') })} tabIndex={0}>
        
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
