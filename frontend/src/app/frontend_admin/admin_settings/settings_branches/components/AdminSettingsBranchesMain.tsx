'use client';

import AdminSettingsBranchesPanel from '@/app/frontend_admin/admin_settings/settings_branches/components/AdminSettingsBranchesPanel';
import { isFrontendDemoModeEnabled } from '@/lib/runtimeFeatures';
import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AdminSettingsBranchesMain() {
  const t = useTranslations('ADMIN_BRANCHES');
  const isDemoMode = isFrontendDemoModeEnabled();

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {!isDemoMode && (
        <p className="rounded-xl border border-warning bg-warning-bg p-4 text-sm font-medium text-warning-text" role="status">
          {t('LIVE_UNAVAILABLE_NOTICE')}
        </p>
      )}

      <header className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-focus bg-primary-subtle px-3 py-1 text-xs font-semibold text-primary">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t('HEADER_BADGE')}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">{t('PAGE_TITLE')}</h1>
          <p className="text-sm text-text-secondary">{t('PAGE_SUBTITLE')}</p>
        </div>
      </header>

      <AdminSettingsBranchesPanel />
    </div>
  );
}
