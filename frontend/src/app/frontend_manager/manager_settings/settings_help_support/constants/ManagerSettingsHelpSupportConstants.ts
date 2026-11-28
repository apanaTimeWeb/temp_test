import type { ManagerSettingsHelpSupportTab } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportTypes';
import { Megaphone,Ticket } from 'lucide-react';

/** Static navigation configuration owned by the Help & Support feature. */
export const MANAGER_HELP_SUPPORT_TABS: readonly ManagerSettingsHelpSupportTab[] = [
  { name: 'Support Tickets', icon: Ticket, color: 'text-success', bg: 'bg-success-bg' },
  { name: 'Announcements', icon: Megaphone, color: 'text-warning', bg: 'bg-warning-bg' },
] as const;
