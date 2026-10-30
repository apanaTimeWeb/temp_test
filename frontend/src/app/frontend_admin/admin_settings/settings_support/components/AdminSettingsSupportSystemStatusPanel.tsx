// RESPONSIBILITY: AdminSupportSystemStatusPanel component owned by admin_support; responsibility folder: admin_support_components_cards.
'use client';

import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ADMIN_SUPPORT_SYSTEM_STATUS_FIXTURES } from '@/app/frontend_admin/admin_settings/settings_support/mocks/scenarios/admin_settings_support.scenarios';

/** Displays illustrative system-status fixtures only when the parent has confirmed demo mode. */
export default function AdminSupportSystemStatusPanel() {
  const t = useTranslations('ADMIN_SUPPORT');
  return (
    <section className="admin-card" aria-labelledby="admin-support-system-status-title">
      <h2 id="admin-support-system-status-title" className="text-base font-semibold text-text-primary">{t('STATUS_TITLE')}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {ADMIN_SUPPORT_SYSTEM_STATUS_FIXTURES.map((system) => (
          <article key={system.nameKey} className="flex items-center gap-3 rounded-md border border-border p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-md bg-input ${system.tone === 'success' ? 'text-success-text' : 'text-warning-text'}`} aria-hidden="true">
              <Activity size={18} strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-text-primary">{t(system.nameKey)}</h3>
              <p className="mt-1 text-sm text-text-secondary">{t(system.statusKey)} · {system.uptime} {t('UPTIME_SUFFIX')}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
