'use client';
import SuperadminSecurityIpFirewallEmptyState from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/components/SuperadminSecurityIpFirewallEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the superadmin_security overview route UI; the module Main remains a thin composition boundary. */
/** Data-Flow: canonical route -> SuperadminSecurityIpFirewallPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  SUPERADMIN_SECURITY_LOGIN_SCHEMA,
  SUPERADMIN_SECURITY_PASSWORD_SCHEMA,
} from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/schemas/SuperadminSecurityIpFirewallPolicySchema';
import type { SuperadminSecurityLoginRules, SuperadminSecurityPasswordPolicy } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/types/SuperadminSecurityIpFirewallTypes';
import { SUPERADMIN_SECURITY_LOGIN_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_PASSWORD_PREVIEW_DEFAULTS, SUPERADMIN_SECURITY_FAILED_LOGINS, SUPERADMIN_SECURITY_SESSIONS, SUPERADMIN_SECURITY_IP_RULES } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/mocks/fixtures/SuperadminSecurityIpFirewallPreviewMockFixtures';
import SuperadminSecurityIpFirewallOperationsPanels from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/components/SuperadminSecurityIpFirewallOperationsPanels';

import { ShieldAlert, AlertCircle, Globe, Flame, Ban, ShieldCheck, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSuperadminSecurityIpFirewallUnsavedChangesGuard } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/hooks/useSuperadminSecurityIpFirewallUnsavedChangesGuard';
import { SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS } from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/constants/SuperadminSecurityIpFirewallStaticConstants';

/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityIpFirewallPageClient`.
 * Owns local UI state for `activeTab` and `newIp`; preview feedback uses deduplicated Sonner messages.
 * Dirty form state is guarded before destructive or route-leaving actions.
 * Demonstration mutations remain local preview behavior and do not imply server persistence.
 */
export default function SuperadminSecurityIpFirewallPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const securityRows: (typeof SUPERADMIN_SECURITY_IP_RULES)[number][] = [...SUPERADMIN_SECURITY_IP_RULES];
  const [activeTab] = useState("IP Firewall");
  const showToast = (msg: string) => {
    toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityIpFirewallPageClient:feedback' });
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
  useSuperadminSecurityIpFirewallUnsavedChangesGuard(loginForm.formState.isDirty || passwordForm.formState.isDirty, tCopy('COPY.UNSAVED_CHANGES_WARNING'));
  const [newIp, setNewIp] = useState('');

  const handleForceLogout = (id: number) => {
    showToast(tCopy("COPY.SESSION_TERMINATION_UNAVAILABLE", { id }));
  };

  const handleAddIp = () => {
    if (!newIp) return;
    showToast(tCopy("COPY.UNAVAILABLE_NO_FIREWALL_API_CONTRACT_IS_SUPPLIED_THE_IP_RULE_WAS_NOT_APPLIED"));
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

  const blockedCount = SUPERADMIN_SECURITY_IP_RULES.filter((r) => r.type === 'BLOCKED').length;
  const allowedCount = SUPERADMIN_SECURITY_IP_RULES.filter((r) => r.type === 'ALLOWED').length;

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {securityRows.length === 0 && <SuperadminSecurityIpFirewallEmptyState filtered />}

      {/* Notice Callout */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 backdrop-blur-md" role="status">
        <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-400" aria-hidden="true" />
        <p className="min-w-0 flex-1 leading-relaxed">
          {tCopy("COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS")}
        </p>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-indigo-950/80 via-[#0a0d22] to-[#060810] p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
                <Flame size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                IP Firewall & Network Rules
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse" />
                Firewall Filtering Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Network perimeter filtering, CIDR whitelisting, and automated brute-force IP quarantine across global reverse proxies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300">
              <Globe size={15} className="text-indigo-400" aria-hidden="true" />
              <span>{SUPERADMIN_SECURITY_IP_RULES.length} IP Rules Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#1b0d2d]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total IP Rules</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-400 shadow-inner">
              <Globe size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-purple-400 tabular-nums">{SUPERADMIN_SECURITY_IP_RULES.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Configured subnets & CIDRs</div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#220a14]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Blocked CIDRs</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400 shadow-inner">
              <Ban size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 tabular-nums">{blockedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Zero-tolerance ingress drop</div>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#06201a]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Allowed Networks</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400 shadow-inner">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tabular-nums">{allowedCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">Trusted HQ & branch gateways</div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#241306]/80 to-[#0a0d24]/95 p-5 shadow-xl backdrop-blur-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Edge Filtering</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-400 shadow-inner">
              <Flame size={18} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tabular-nums">Enforcing</div>
          <div className="text-[11px] text-slate-400 mt-1">Edge firewall sync verified</div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-[#0c0f2b] via-[#090b20] to-[#060818] shadow-2xl overflow-hidden backdrop-blur-xl min-h-[420px] flex flex-col"
        aria-label="IP Firewall Settings"
        tabIndex={0}
      >
        <SuperadminSecurityIpFirewallOperationsPanels
          activeTab={activeTab}
          newIp={newIp}
          setNewIp={setNewIp}
          ipRules={SUPERADMIN_SECURITY_IP_RULES}
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
