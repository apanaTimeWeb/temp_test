'use client';
/** Responsibility: security-centre landing overview; individual policy and operational controls are owned by their canonical feature leaves. */
/** Data-Flow: local sample-only security fixtures -> summary metrics -> links to canonical security control routes; no policy mutation or session termination is performed here. */
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_security/security_overview/config/superadmin_security_overview.url_config.ts';
import Link from 'next/link';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SUPERADMIN_SECURITY_TABS } from '@/app/frontend_superadmin/superadmin_security/security_overview/constants/SuperadminSecurityOverviewConstants';
import { SUPERADMIN_SECURITY_FAILED_LOGINS, SUPERADMIN_SECURITY_SESSIONS, SUPERADMIN_SECURITY_API_KEYS, SUPERADMIN_SECURITY_IP_RULES } from '@/app/frontend_superadmin/superadmin_security/security_overview/mocks/fixtures/SuperadminSecurityOverviewPreviewMockFixtures';
export default function SuperadminSecurityOverviewPageClient() {
  const t = useTranslations('SUPERADMIN_SECURITY');
  const routes: Record<string, string> = {
    'Login Security': SUPERADMIN_NAVIGATION_ROUTES.security_login_security,
    'Password Policy': SUPERADMIN_NAVIGATION_ROUTES.security_password_policy,
    '2FA & MFA': SUPERADMIN_NAVIGATION_ROUTES.security_mfa,
    'IP Firewall': SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall,
    'API Keys': SUPERADMIN_NAVIGATION_ROUTES.security_api_keys,
    'Active Sessions': SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions,
    'Audit & Threats': SUPERADMIN_NAVIGATION_ROUTES.security_threats,
  };
  const metrics = [
    { id: 'failed-logins', label: t('COPY.FAILED_LOGIN_ATTEMPTS'), count: SUPERADMIN_SECURITY_FAILED_LOGINS.length },
    { id: 'active-sessions', label: t('COPY.ACTIVE_SESSION_COUNT'), count: SUPERADMIN_SECURITY_SESSIONS.length },
    { id: 'api-key-prefixes', label: t('COPY.API_KEY_PREFIX_COUNT'), count: SUPERADMIN_SECURITY_API_KEYS.length },
    { id: 'firewall-rules', label: t('COPY.IP_FIREWALL_RULE_COUNT'), count: SUPERADMIN_SECURITY_IP_RULES.length },
  ];

  return (
    <div className="sa-page-animate relative pb-10">
      <p className="mb-5 rounded-lg border border-border bg-warning-bg p-3 text-sm text-warning" role="status">{t('COPY.SECURITY_POLICIES_SESSIONS_API_KEY_PREFIXES_FIREWALL_RULES_AND_THREAT_ROWS_ARE_SAMPLE_PREVIEW_DATA_THIS_SCREEN_DOES_NOT_ENFORCE_POLICIES_OR_TERMINATE_SESSIONS_WITHOUT_VERIFIED_HOST_SECURITY_API_CONTRACTS')}</p>
      <div className="flex flex-col gap-1 mb-8">
        <div className="sa-breadcrumb"><span>{t('COPY.LIBRARY_OS')}</span><span>/</span><span>{t('COPY.SUPER_ADMIN')}</span><span>/</span><span>{t('COPY.SECURITY_CENTER')}</span></div>
        <div className="flex items-center justify-between gap-3 mt-2">
          <h1 className="sa-page-title flex items-center gap-3"><ShieldAlert className="text-danger drop-shadow-card" size={28} aria-hidden="true" />{t('COPY.SECURITY_CENTER')}</h1>
          <span className="bg-danger-bg text-danger border border-border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2"><AlertCircle size={14} aria-hidden="true" />{t('COPY.CRITICAL_ZONE_SUPERADMIN_ONLY')}</span>
        </div>
        <p className="mt-2 text-sm text-secondary">{t('COPY.SECURITY_OVERVIEW_SUMMARY')}</p>
      </div>

      <section aria-label={t('COPY.SECURITY_OVERVIEW_SUMMARY')} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => <article key={metric.id} className="sa-card p-5"><p className="text-sm text-secondary">{metric.label}</p><p className="mt-2 text-3xl font-bold text-primary tabular-nums">{metric.count}</p><p className="mt-2 text-xs text-warning">{t('COPY.STATUS_SAMPLE')}</p></article>)}
      </section>

      <section aria-labelledby="superadmin-security-control-leaves-title">
        <h2 id="superadmin-security-control-leaves-title" className="text-lg font-bold text-primary mb-4">{t('COPY.SECURITY_CENTER_SECTIONS')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {SUPERADMIN_SECURITY_TABS.map((tab) => {
            const href = routes[tab.name];
            return <Link key={tab.name} href={href} aria-label={`${t('COPY.OPEN_SECURITY_CONTROL')}: ${t(tab.labelKey)}`} className="sa-card p-5 flex items-center justify-between gap-4 hover:border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info" data-testid={`superadmin-security-overview-open-${tab.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
              <span className="flex items-center gap-3"><tab.icon size={20} aria-hidden="true" /><span className="font-semibold text-primary">{t(tab.labelKey)}</span></span>
              <span className="text-xs text-secondary">{t('COPY.OPEN_SECURITY_CONTROL')} →</span>
            </Link>;
          })}
        </div>
      </section>
    </div>
  );
}
