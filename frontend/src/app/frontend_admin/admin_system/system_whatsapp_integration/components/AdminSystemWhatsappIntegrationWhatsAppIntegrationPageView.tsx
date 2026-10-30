// RESPONSIBILITY: AdminSystemWhatsAppIntegrationPageView component owned by admin_system; responsibility folder: admin_system_components_views.
'use client';

import { useTranslations } from 'next-intl';
import { MessageSquare, ChevronRight, BarChart3 } from 'lucide-react';
import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSection from '@/app/frontend_admin/admin_system/system_whatsapp_integration/components/AdminSystemWhatsappIntegrationWhatsAppIntegrationPageViewIntegrationConfigCardSection';

import AdminSystemWhatsAppIntegrationHealthSection from '@/app/frontend_admin/admin_system/system_whatsapp_integration/components/AdminSystemWhatsappIntegrationWhatsAppIntegrationHealthSection';
import AdminSystemWhatsAppIntegrationStatsSection from '@/app/frontend_admin/admin_system/system_whatsapp_integration/components/AdminSystemWhatsappIntegrationWhatsAppIntegrationStatsSection';
import AdminSystemWhatsAppIntegrationLogsSection from '@/app/frontend_admin/admin_system/system_whatsapp_integration/components/AdminSystemWhatsappIntegrationWhatsAppIntegrationLogsSection';
import type { AdminSystemWhatsAppIntegrationPageViewProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';


export default function AdminSystemWhatsAppIntegrationPageView({ model }: AdminSystemWhatsAppIntegrationPageViewProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  return (
    <div>
      <p role="status" className="mb-5 rounded-md border border-warning-bg bg-warning-bg p-3 text-sm text-warning-text">{t('WHATSAPP_PREVIEW_NOTICE')}</p>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium tracking-wide mb-1">
          <span>{t('BREADCRUMB_SYSTEM')}</span><ChevronRight size={18} strokeWidth={2} /><span>{t('WHATSAPP_INTEGRATION')}</span>
        </div>
        <h1 className="text-page-title font-bold text-text-primary flex items-center gap-3">
          <MessageSquare size={18} strokeWidth={2} className="text-primary" />
          {t('WHATSAPP_INTEGRATION')}
        </h1>
        <p className="text-text-secondary mt-1 text-sm">
          {t('WHATSAPP_SETUP_DESCRIPTION')}
        </p>
      </div>

<AdminSystemWhatsAppIntegrationHealthSection model={model} />

<AdminSystemWhatsAppIntegrationStatsSection model={model} />

      <AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSection model={model} />

<AdminSystemWhatsAppIntegrationLogsSection model={model} />

    </div>
  );
}


export type { AdminSystemWhatsAppIntegrationPageViewProps };
