'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/config/superadmin_security_active_sessions.url_config.ts';
import SuperadminSecurityActiveSessionsEmptyState from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/components/SuperadminSecurityActiveSessionsEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_security overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSecurityActiveSessionsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/schemas/SuperadminSecurityActiveSessionsPolicySchema';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/types/SuperadminSecurityActiveSessionsTypes';
import { SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_FAILED_LOGINS, SUPERADMIN_SECURITY_SESSIONS, SUPERADMIN_SECURITY_API_KEYS, SUPERADMIN_SECURITY_IP_RULES } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/mocks/fixtures/SuperadminSecurityActiveSessionsPreviewMockFixtures';

import SuperadminSecurityActiveSessionsOperationsPanels from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/components/SuperadminSecurityActiveSessionsOperationsPanels';
import { ShieldAlert, AlertCircle, Activity, Globe, Smartphone, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityActiveSessionsUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/hooks/useSuperadminSecurityActiveSessionsUnsavedChangesGuard';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/constants/SuperadminSecurityActiveSessionsConstants';
import { SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS } from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/constants/SuperadminSecurityActiveSessionsStaticConstants';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityActiveSessionsPageClient`.
 * Owns local UI state for `activeTab` and `newIp`; preview feedback uses deduplicated Sonner messages.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityActiveSessionsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const securityRows: (typeof SUPERADMIN_SECURITY_SESSIONS)[number][] = [...SUPERADMIN_SECURITY_SESSIONS];
  
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
    if (route) {
      const target = new URL(route, window.location.origin);
      const query = new URLSearchParams(window.location.search);
      query.delete('view');
      query.forEach((value, k) => {
        if (!target.searchParams.has(k)) target.searchParams.append(k, value);
      });
      window.location.assign(target.pathname + target.search + target.hash);
    }
  };

  const [activeTab] = useState("Active Sessions");
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityActiveSessionsPageClient:feedback' });
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
  useSuperadminSecurityActiveSessionsUnsavedChangesGuard(loginForm.formState.isDirty || passwordForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const [newIp, setNewIp] = useState('');

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
    if (!newIp) return;
    showToast(tCopy("COPY.UNAVAILABLE_NO_FIREWALL_API_CONTRACT_IS_SUPPLIED_THE_IP_RULE_WAS_NOT_APPLIED"));
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {securityRows.length === 0 && <SuperadminSecurityActiveSessionsEmptyState filtered />}

      {/* Warning Callout */}
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
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{tCopy("COPY.LIBRARY_OS")}</span>
              <span>/</span>
              <span>{tCopy("COPY.SUPER_ADMIN")}</span>
              <span>/</span>
              <span className="text-indigo-400">{tCopy("COPY.SECURITY_CENTER")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <ShieldAlert size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                {tCopy("COPY.SECURITY_CENTER")}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300">
              <Activity size={15} className="text-indigo-400" aria-hidden="true" />
              <span>Active Sessions: {SUPERADMIN_SECURITY_SESSIONS.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto" role="navigation" aria-label={tCopy("COPY.SECURITY_CENTER_SECTIONS")}>
        {SUPERADMIN_SECURITY_TABS.map((tab) => {
          const isActive = activeTab === tab.name;
          return (
            <button
              type="button"
              key={tab.name}
              id={`security-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => navigateToWorkflow(tab.name)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border border-indigo-400 bg-indigo-500/15 text-indigo-200 shadow-xs'
                  : 'text-slate-400 hover:bg-surface-hover hover:text-slate-200'
              }`}
              data-testid={`superadmin-security-security-overview-set-active-tab-1-${String(tab.name)}`}
            >
              <tab.icon size={15} className={isActive ? 'text-indigo-400' : 'text-slate-400'} />
              <span>{tCopy(tab.labelKey)}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panes */}
      <div
        className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden min-h-[420px] flex flex-col"
        aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy(SUPERADMIN_SECURITY_TABS.find((tab) => tab.name === activeTab)?.labelKey ?? 'COPY.TAB_LOGIN_SECURITY') })}
        tabIndex={0}
      >
        <SuperadminSecurityActiveSessionsOperationsPanels
          activeTab={activeTab}
          newIp={newIp}
          setNewIp={setNewIp}
          ipRules={SUPERADMIN_SECURITY_IP_RULES}
          apiKeys={SUPERADMIN_SECURITY_API_KEYS}
          sessions={SUPERADMIN_SECURITY_SESSIONS}
          failedLogins={SUPERADMIN_SECURITY_FAILED_LOGINS}
          handleAddIp={handleAddIp}
          handleForceLogout={handleForceLogout}
          handleExportLogs={handleExportLogs}
          showToast={showToast}
        />
      </div>
    </div>
  );
}
