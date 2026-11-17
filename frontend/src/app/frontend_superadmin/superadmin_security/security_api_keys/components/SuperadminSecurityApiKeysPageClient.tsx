'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/config/superadmin_security_api_keys.url_config.ts';
import SuperadminSecurityApiKeysEmptyState from '@/app/frontend_superadmin/superadmin_security/security_api_keys/components/SuperadminSecurityApiKeysEmptyState';
/** Responsibility: render only the independently refreshable API Keys route; sibling security workflows have their own canonical leaves. */
/** Data-Flow: API Keys route -> local, redacted sample key fixtures -> read-only preview; secure issuance/reveal/revocation remain disabled without host contracts. */
import { ShieldAlert, AlertCircle, Key, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/constants/SuperadminSecurityApiKeysConstants';
import { SUPERADMIN_SECURITY_API_KEYS } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/mocks/fixtures/SuperadminSecurityApiKeysPreviewMockFixtures';
import SuperadminSecurityApiKeysOperationsPanels from '@/app/frontend_superadmin/superadmin_security/security_api_keys/components/SuperadminSecurityApiKeysOperationsPanels';

export default function SuperadminSecurityApiKeysPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const activeTab = 'API Keys';

  const navigateToWorkflow = (key: string) => {
    const routes: Record<string, string> = {
      'Login Security': SUPERADMIN_NAVIGATION_ROUTES.security_login_security,
      'Password Policy': SUPERADMIN_NAVIGATION_ROUTES.security_password_policy,
      '2FA & MFA': SUPERADMIN_NAVIGATION_ROUTES.security_mfa,
      'IP Firewall': SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall,
      'API Keys': SUPERADMIN_NAVIGATION_ROUTES.security_api_keys,
      'Active Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions,
      'Audit & Threats': SUPERADMIN_NAVIGATION_ROUTES.security_threats,
    };
    const route = routes[key];
    if (!route) return;
    const target = new URL(route, window.location.origin);
    const query = new URLSearchParams(window.location.search);
    query.delete('view');
    query.forEach((value, queryKey) => {
      if (!target.searchParams.has(queryKey)) target.searchParams.append(queryKey, value);
    });
    window.location.assign(target.pathname + target.search + target.hash);
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-12">
      {(SUPERADMIN_SECURITY_API_KEYS as readonly unknown[]).length === 0 && <SuperadminSecurityApiKeysEmptyState filtered />}

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
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>{tCopy("COPY.LIBRARY_OS")}</span>
              <span>/</span>
              <span>{tCopy("COPY.SUPER_ADMIN")}</span>
              <span>/</span>
              <span className="text-indigo-400">{tCopy("COPY.SECURITY_CENTER")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-inner">
                <Key size={24} aria-hidden="true" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100">
                API Keys
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Prefix Hashing Active
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-300">
              <AlertCircle size={15} className="text-rose-400" aria-hidden="true" />
              <span>{tCopy("COPY.CRITICAL_ZONE_SUPERADMIN_ONLY")}</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-bold text-indigo-300">
              <ShieldCheck size={15} className="text-indigo-400" aria-hidden="true" />
              <span>{SUPERADMIN_SECURITY_API_KEYS.length} Scoped Keys</span>
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

      {/* Content */}
      <div
        className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden min-h-[420px] flex flex-col"
        aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy('COPY.TAB_API_KEYS') })}
        tabIndex={0}
      >
        <SuperadminSecurityApiKeysOperationsPanels apiKeys={SUPERADMIN_SECURITY_API_KEYS} />
      </div>
    </div>
  );
}
