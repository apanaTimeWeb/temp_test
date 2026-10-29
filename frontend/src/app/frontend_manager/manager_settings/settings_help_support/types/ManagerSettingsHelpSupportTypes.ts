import type { LucideIcon } from 'lucide-react';

export type ManagerSettingsHelpSupportTabName = 'Help Center' | 'Documentation' | 'Support Tickets' | 'Announcements' | 'System Status';
export type ManagerSettingsHelpSupportTicketTab = 'My Tickets' | 'Create Ticket';
export type ManagerSettingsHelpSupportDocumentationCategory = 'All' | 'Student Management';

export interface ManagerSettingsHelpSupportTab { name: ManagerSettingsHelpSupportTabName; icon: LucideIcon; color: string; bg: string; }
export interface ManagerSettingsHelpSupportTabsProps { tabs: readonly ManagerSettingsHelpSupportTab[]; activeTab: string; onSelect: (tabName: ManagerSettingsHelpSupportTabName) => void; }
export interface ManagerSettingsHelpSupportToastProps { message: string; }
