'use client';
// RESPONSIBILITY: AdminSecurityDashboardPanel component owned by admin_security; responsibility folder: admin_security_dashboard_panel.

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_SECURITY_DASHBOARD_METRICS } from '@/app/frontend_admin/admin_settings/settings_security/mocks/scenarios/admin_settings_security.scenarios';

/** Shows clearly synthetic dashboard metrics; values are not live security telemetry. */
export default function AdminSecurityDashboardPanel() {
  const t = useTranslations('ADMIN_SECURITY');
  return (
    <section className="admin-card p-6" aria-labelledby="admin-security-dashboard-title">
      <h2 id="admin-security-dashboard-title" className="mb-5 text-section-title font-semibold text-text-primary">{t('DASHBOARD_TITLE')}</h2>
      <p className="mb-4 text-sm text-text-secondary">{t('DEMO_DATA_NOTICE')}</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SECURITY_DASHBOARD_METRICS.map((metric) => (
          <article key={metric.id} className="rounded-lg border border-border bg-floating p-5">
            <p className="text-sm text-text-secondary">{t(metric.labelKey)}</p>
            <p className={`mt-2 text-3xl font-bold ${metric.tone === 'success' ? 'text-success-text' : metric.tone === 'danger' ? 'text-danger-text' : 'text-warning-text'}`}>{metric.value}</p>
          </article>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-lg border border-success-bg bg-success-bg p-4 text-success-text">
        <Shield size={18} strokeWidth={2} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>{t('DASHBOARD_STATUS_SAMPLE')}</p>
      </div>
    </section>
  );
}
