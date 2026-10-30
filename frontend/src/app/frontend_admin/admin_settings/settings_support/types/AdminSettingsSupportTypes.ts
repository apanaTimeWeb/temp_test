import type { LucideIcon } from 'lucide-react';
import type { AdminSettingsSupportScenario } from '@/app/frontend_admin/admin_settings/settings_support/tests/harness/bootstrap';
import type { ReactNode } from 'react';

export type AdminSupportTab = 'help' | 'tickets' | 'status' | 'announcements' | 'docs';

export interface AdminSupportNavigationItem {
  id: AdminSupportTab;
  labelKey: AdminSupportNavigationItemLabelKey;
  icon: LucideIcon;
}

export type AdminSupportNavigationItemLabelKey = 'NAV_HELP' | 'NAV_TICKETS' | 'NAV_STATUS' | 'NAV_ANNOUNCEMENTS' | 'NAV_DOCS';

export interface AdminSupportCreateTicketFormProps {
  onCancel: () => void;
}

export interface AdminSettingsSupportHarnessProps {
  children: ReactNode;
  scenario?: AdminSettingsSupportScenario;
}
