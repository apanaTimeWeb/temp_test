// RESPONSIBILITY: AdminSystemWhatsAppIntegrationHealthSection component owned by admin_system; responsibility folder: admin_system_whatsapp_integration_page_view_sections.
import { useTranslations } from 'next-intl';
import { AdminSystemBadge } from '@/app/frontend_admin/components/ui/admin-primitives/AdminPrimitiveBadge';
import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import type { AdminSystemWhatsAppIntegrationHealthSectionProps } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/types/AdminSystemWhatsappIntegrationWhatsAppTypes';


export default function AdminSystemWhatsAppIntegrationHealthSection({ model }: AdminSystemWhatsAppIntegrationHealthSectionProps) {
  const t = useTranslations('ADMIN_SYSTEM_EXTRA');
  return (
    <>
      {/* Provider health cannot be shown as connected until a real server-side check exists. */}
            <div data-testid="admin_system-AdminSystemWhatsAppIntegrationPageView-state-001" className="flex items-center gap-4 p-4 rounded-2xl border border-warning-bg bg-warning-bg mb-8" role="status">
              <div data-testid="admin_system-AdminSystemWhatsAppIntegrationPageView-state-002" className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl bg-card">{t('ANTENNA')}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="text-base font-semibold text-text-primary">{t('WHATSAPP_CONNECTION_UNVERIFIED')}</p>
                  <AdminSystemBadge variant="warning">{t('UNAVAILABLE')}</AdminSystemBadge>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">{t('WHATSAPP_TEST_NOT_RUN')}</p>
              </div>
            </div>
    </>
  );
}
