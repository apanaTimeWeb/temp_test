import type useSettingsPage from '@/app/frontend_admin/admin_system/system_settings/hooks/useAdminSystemSettingsPage';
import type { AdminSystemSettingsScenario } from '@/app/frontend_admin/admin_system/system_settings/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export interface AdminSystemSettingsCanonicalDestinationCardProps {
  title: string;
  href: string;
}

export interface AdminSystemSettingsNotificationsSectionProps {
  model: ReturnType<typeof useSettingsPage>;
}

export interface AdminSystemSettingsPageViewProps {
  model: ReturnType<typeof useSettingsPage>;
}

export interface AdminSystemSettingsUpiSectionProps {
  model: ReturnType<typeof useSettingsPage>;
}

export interface AdminSystemSettingsHarnessProps { children: ReactNode; scenario?: AdminSystemSettingsScenario; }

export type AdminSystemSettingsadmin_system_settingsurl_configLabelKey = 'BRANDING' | 'LATE_FEE_RULES' | 'AUTO_SUSPEND_RULES' | 'UPI_PAYMENT' | 'NOTIFICATIONS' | 'GENERAL';
export type AdminSystemSettingsadmin_system_settingsurl_configLabelKey2 = 'PAYMENT_MODE_CASH' | 'PAYMENT_MODE_UPI' | 'PAYMENT_MODE_CARD' | 'PAYMENT_MODE_BANK_TRANSFER';
