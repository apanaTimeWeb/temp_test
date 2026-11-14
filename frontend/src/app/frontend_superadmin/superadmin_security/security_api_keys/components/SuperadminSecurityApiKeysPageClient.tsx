'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_api_keys/config/superadmin_security_api_keys.url_config.ts';
import SuperadminSecurityApiKeysEmptyState from '@/app/frontend_superadmin/superadmin_security/security_api_keys/components/SuperadminSecurityApiKeysEmptyState';
/** Responsibility: render only the independently refreshable API Keys route; sibling security workflows have their own canonical leaves. */
/** Data-Flow: API Keys route -> local, redacted sample key fixtures -> read-only preview; secure issuance/reveal/revocation remain disabled without host contracts. */
import { ShieldAlert, AlertCircle } from 'lucide-react';
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
    <div className="sa-page-animate relative pb-10">
      {SUPERADMIN_SECURITY_API_KEYS.length === 0 && <SuperadminSecurityApiKeysEmptyState filtered />}

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

      <div className="flex items-center gap-2 mb-6 border-b border-border pb-2 overflow-x-auto hide-scrollbar" role="navigation" aria-label={tCopy("COPY.SECURITY_CENTER_SECTIONS")}>
        {SUPERADMIN_SECURITY_TABS.map((tab) => (
          <button
            type="button"
            key={tab.name}
            id={`security-tab-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
            aria-current={activeTab === tab.name ? 'page' : undefined}
            onClick={() => navigateToWorkflow(tab.name)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold motion-safe:transition-all motion-reduce:transition-none whitespace-nowrap ${
              activeTab === tab.name
                ? 'bg-danger-bg text-primary border border-border shadow-card'
                : 'text-secondary hover:bg-surface-hover hover:text-primary'
            }`}
            data-testid={`superadmin-security-security-overview-set-active-tab-1-${String(tab.name)}`}
          >
            <tab.icon size={16} /> {tCopy(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="sa-card p-0 h-150 flex flex-col overflow-hidden border-border" aria-label={tCopy('COPY.ACTIVE_TAB_SETTINGS_ARIA_LABEL', { tab: tCopy('COPY.TAB_API_KEYS') })} tabIndex={0}>
        <SuperadminSecurityApiKeysOperationsPanels apiKeys={SUPERADMIN_SECURITY_API_KEYS} />
      </div>
    </div>
  );
}
