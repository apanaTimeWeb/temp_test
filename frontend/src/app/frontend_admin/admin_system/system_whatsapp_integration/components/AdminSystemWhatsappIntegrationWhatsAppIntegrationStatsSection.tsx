// RESPONSIBILITY: AdminSystemWhatsAppIntegrationStatsSection component owned by admin_system; responsibility folder: admin_system_whatsapp_integration_page_view_sections.
import { useTranslations } from 'next-intl';
import { AdminSystemKpiCard } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveKpiCard';
import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import type { AdminSystemWhatsAppIntegrationStatsSectionProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';


export default function AdminSystemWhatsAppIntegrationStatsSection({ model }: AdminSystemWhatsAppIntegrationStatsSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  const { MESSAGE_LOGS, deliveredCount, failedCount } = model;
  return (
    <>
      {/* Usage Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <AdminSystemKpiCard title={t('SAMPLE_MESSAGES')} value={MESSAGE_LOGS.length} icon="📤" subtitle={t('SYNTHETIC_FIXTURE_ONLY')} />
              <AdminSystemKpiCard title={t('SAMPLE_DELIVERED')} value={deliveredCount} icon="✅" subtitle={t('NOT_LIVE_DELIVERY_DATA')} />
              <AdminSystemKpiCard title={t('SAMPLE_FAILED')} value={failedCount} icon="❌" subtitle={t('NOT_LIVE_DELIVERY_DATA')} />
              <AdminSystemKpiCard title={t('EXAMPLE_COST')} value="₹18.50" icon="💸" subtitle={t('ILLUSTRATIVE_AMOUNT_ONLY')} />
            </div>
    </>
  );
}
