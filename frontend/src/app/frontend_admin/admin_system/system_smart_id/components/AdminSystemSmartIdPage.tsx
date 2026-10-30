// RESPONSIBILITY: AdminSystemSmartIdPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { Hash, ChevronRight } from 'lucide-react';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';
import AdminSystemSmartIdFlowSection from '@/app/frontend_admin/admin_system/system_smart_id/components/AdminSystemSmartIdFlowSection';
import AdminSystemSmartIdSequenceSection from '@/app/frontend_admin/admin_system/system_smart_id/components/AdminSystemSmartIdSequenceSection';
import AdminSystemSmartIdOverrideSection from '@/app/frontend_admin/admin_system/system_smart_id/components/AdminSystemSmartIdOverrideSection';

export function AdminSystemSmartIdPage() {
  const t = useTranslations('ADMIN_SYSTEM_SMART_ID');
  const isDemoMode = isFrontendDemoModeEnabled();
  return (
    <div>
      <p role="status" className="mb-4 rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text">{isDemoMode ? t('DEMO_NOTICE') : t('LIVE_UNAVAILABLE_NOTICE')}</p>
      <header className="mb-8">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium tracking-wide text-text-secondary"><span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('BREADCRUMB_SMART_ID')}</span></div>
        <h1 className="flex items-center gap-3 text-page-title font-bold text-text-primary"><Hash size={18} strokeWidth={2} className="text-primary" />{t('TITLE')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('SUBTITLE')}</p>
      </header>
      <AdminSystemSmartIdFlowSection />
      {isDemoMode && <AdminSystemSmartIdSequenceSection />}
      {isDemoMode && <AdminSystemSmartIdOverrideSection />}
    </div>
  );
}
