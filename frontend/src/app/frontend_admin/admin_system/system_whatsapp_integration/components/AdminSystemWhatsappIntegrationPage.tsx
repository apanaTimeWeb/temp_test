// Responsibility: AdminSystemWhatsappIntegrationPage component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import AdminSystemWhatsAppIntegrationPageView from '@/app/frontend_admin/admin_system/system_whatsapp_integration/components/AdminSystemWhatsappIntegrationWhatsAppIntegrationPageView';
import { isFrontendDemoModeEnabled } from '@/app/frontend_admin/lib/runtimeFeatures';

// RESPONSIBILITY: Owns orchestration only; the interactive state model is in the module hook and presentation is in the module view.
export function AdminSystemWhatsappIntegrationPage() {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const model = useWhatsAppIntegrationPage();
  if (!isFrontendDemoModeEnabled()) {
    return <section className="space-y-3 rounded-lg border border-warning-bg bg-card p-6"><h1 className="text-page-title font-bold text-text-primary">{t('WHATSAPP_UNAVAILABLE_TITLE')}</h1><p role="status" className="text-warning-text">{t('WHATSAPP_UNAVAILABLE_DESCRIPTION')}</p></section>;
  }
  return <div className="space-y-4"><p className="rounded-md border border-warning-bg bg-warning-bg p-3 text-warning-text" role="status">{t('WHATSAPP_DEMO_NOTICE')}</p><AdminSystemWhatsAppIntegrationPageView model={model} /></div>;
}
