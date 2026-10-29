import { Activity, Book, HelpCircle, Megaphone, Ticket } from 'lucide-react';
import type { ManagerSettingsHelpSupportTab } from '@/app/frontend_manager/manager_settings/settings_help_support/types/ManagerSettingsHelpSupportTypes';

/** Static navigation configuration owned by the Help & Support feature. */
export const MANAGER_HELP_SUPPORT_TABS: readonly ManagerSettingsHelpSupportTab[] = [
  { name: 'Help Center', icon: HelpCircle, color: 'text-info', bg: 'bg-info-bg' },
  { name: 'Documentation', icon: Book, color: 'text-purple', bg: 'bg-purple-bg' },
  { name: 'Support Tickets', icon: Ticket, color: 'text-success', bg: 'bg-success-bg' },
  { name: 'Announcements', icon: Megaphone, color: 'text-warning', bg: 'bg-warning-bg' },
  { name: 'System Status', icon: Activity, color: 'text-purple', bg: 'bg-purple-bg' },
] as const;

export const MANAGER_HELP_SUPPORT_DOCUMENTATION_CATEGORIES = [
  { value: 'All', labelKey: 'all_documentation' },
  { value: 'Student Management', labelKey: 'student_management' },
] as const;

export const MANAGER_SETTINGS_HELP_SUPPORT_SEARCH_DEBOUNCE_MS = 300;
