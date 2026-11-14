'use client';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_threats/config/superadmin_security_threats.url_config';
import SuperadminSecurityAuditThreatsEmptyState from '@/app/frontend_superadmin/superadmin_security/security_threats/components/SuperadminSecurityThreatsEmptyState';
import { toast } from 'sonner';
/** Responsibility: renders the Security Threats leaf and its Audit & Threats preview only. */
/** Data-Flow: canonical route -> SuperadminSecurityThreatsPageClient -> feature-local sample fixtures and local UI state -> preview rendering; no persistence is claimed. */
import { SUPERADMIN_SECURITY_FAILED_LOGINS } from '@/app/frontend_superadmin/superadmin_security/security_threats/mocks/fixtures/SuperadminSecurityThreatsPreviewMockFixtures';
import SuperadminSecurityThreatsOperationsPanels from '@/app/frontend_superadmin/superadmin_security/security_threats/components/SuperadminSecurityThreatsOperationsPanels';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_threats/constants/SuperadminSecurityThreatsConstants';
import { SUPERADMIN_SECURITY_OVERVIEW_PAGE_CLIENT_FIELDS } from '@/app/frontend_superadmin/superadmin_security/security_threats/constants/SuperadminSecurityThreatsStaticConstants';
/**
 * Renders the `superadmin_security` view owned by `SuperadminSecurityThreatsPageClient`.
 * The active tab is fixed to this canonical leaf; secondary tabs navigate to their dedicated sibling routes.
 * Sample threat rows and CSV export are preview-only and do not imply server persistence.
 */
export default function SuperadminSecurityThreatsPageClient() {
  const tCopy = useTranslations('SUPERADMIN_SECURITY');
  const securityRows: (typeof SUPERADMIN_SECURITY_FAILED_LOGINS)[number][] = [...SUPERADMIN_SECURITY_FAILED_LOGINS];
  
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
const activeTab = 'Audit & Threats';
  const showToast = (msg: string) => { toast.message(msg, { id: 'superadmin:superadmin_security:SuperadminSecurityThreatsPageClient:feedback' }); };

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

  return (
    <div className="sa-page-animate relative pb-10">
      {(securityRows.length === 0) && <SuperadminSecurityAuditThreatsEmptyState filtered />}

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
        
        <SuperadminSecurityThreatsOperationsPanels failedLogins={SUPERADMIN_SECURITY_FAILED_LOGINS} handleExportLogs={handleExportLogs} />
      </div>
    </div>
  );
}
