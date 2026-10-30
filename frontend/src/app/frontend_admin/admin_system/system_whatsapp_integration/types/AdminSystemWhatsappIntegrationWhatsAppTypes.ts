import type useWhatsAppIntegrationPage from '@/app/frontend_admin/admin_system/system_whatsapp_integration/hooks/useAdminSystemWhatsappIntegrationWhatsAppIntegrationPage';
import type { AdminSystemWhatsappIntegrationScenario } from '@/app/frontend_admin/admin_system/system_whatsapp_integration/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemWhatsAppMessageLog {
  id: string;
  to: string;
  type: string;
  status: AdminSystemWhatsAppMessageLogStatus;
  sentAt: string;
  template: string;
}

export interface AdminSystemWhatsAppProvider {
  id: string;
  label: string;
  logo: string;
  requiresSecret: boolean;
}

export type AdminSystemWhatsAppMessageLogStatus = 'delivered' | 'failed' | 'pending';

export interface AdminSystemWhatsAppIntegrationHealthSectionProps {
  model: ReturnType<typeof useWhatsAppIntegrationPage>;
}

export interface AdminSystemWhatsAppIntegrationLogsSectionProps {
  model: ReturnType<typeof useWhatsAppIntegrationPage>;
}

export interface AdminSystemWhatsAppIntegrationPageViewProps {
  model: ReturnType<typeof useWhatsAppIntegrationPage>;
}

export interface AdminSystemWhatsAppIntegrationPageViewIntegrationConfigCardSectionProps {
  model: ReturnType<typeof useWhatsAppIntegrationPage>;
}

export interface AdminSystemWhatsAppIntegrationStatsSectionProps {
  model: ReturnType<typeof useWhatsAppIntegrationPage>;
}

export interface AdminSystemWhatsappIntegrationHarnessProps {
  children: ReactNode;
  scenario?: AdminSystemWhatsappIntegrationScenario;
}

export type AdminSystemWhatsappIntegrationadmin_system_whatsapp_integration_whats_app_constantsVariant = 'success' | 'danger' | 'warning';
