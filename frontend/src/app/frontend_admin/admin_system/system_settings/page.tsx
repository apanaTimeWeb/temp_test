'use client';
import { AdminSystemRoute } from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsRoute';
import AdminSystemSettingsPageView from '@/app/frontend_admin/admin_system/system_settings/components/AdminSystemSettingsPageView';
import useSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import { useTranslations } from 'next-intl';

export default function AdminSystemSettingsRouteEntry() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const model = useSettingsPage();
  const content = !isFrontendDemoModeEnabled()
    ? <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('SYSTEM_SETTINGS')}</h1><p role="status" className="text-warning-text">{t('SETTINGS_LIVE_UNAVAILABLE')}</p></section>
    : <div><p className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('SETTINGS_DEMO_NOTICE')}</p><AdminSystemSettingsPageView model={model} /></div>;
  return <div className="admin-system-settings-surface"><AdminSystemRoute>{content}</AdminSystemRoute></div>;
}
