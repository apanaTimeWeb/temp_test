import { LayoutDashboard, Users, Armchair, WalletCards, Building2, UserCog, SlidersHorizontal, MessageSquare, Settings } from 'lucide-react';
import type { AdminNavItem } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/types/AdminNavigationSidebarTypes';
import { ADMIN_NAVIGATION_URLS } from '@/app/frontend_admin/admin_navigation/admin_navigation_sidebar/config/admin_navigation_sidebar.url_config';

/** One primary sidebar destination per approved business domain; child features navigate in domain secondary navigation. */
export const ADMIN_SIDEBAR_NAV: AdminNavItem[] = [
  { href: ADMIN_NAVIGATION_URLS.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard', labelKey: 'DASHBOARD' },
  { href: ADMIN_NAVIGATION_URLS.MEMBERS, icon: Users, label: 'Members', labelKey: 'MEMBERS' },
  { href: ADMIN_NAVIGATION_URLS.SEATS_SHIFTS_LOCKERS, icon: Armchair, label: 'Seats, Shifts & Lockers', labelKey: 'SEATS_SHIFTS_LOCKERS' },
  { href: ADMIN_NAVIGATION_URLS.FINANCE, icon: WalletCards, label: 'Finance', labelKey: 'FINANCE' },
  { href: ADMIN_NAVIGATION_URLS.ACCOUNTS_ASSETS, icon: Building2, label: 'Accounts & Assets', labelKey: 'ACCOUNTS_ASSETS' },
  { href: ADMIN_NAVIGATION_URLS.STAFF, icon: UserCog, label: 'Staff', labelKey: 'STAFF' },
  { href: ADMIN_NAVIGATION_URLS.SYSTEM, icon: SlidersHorizontal, label: 'System', labelKey: 'SYSTEM' },
  { href: ADMIN_NAVIGATION_URLS.COMMUNICATION, icon: MessageSquare, label: 'Communication', labelKey: 'COMMUNICATION' },
  { href: ADMIN_NAVIGATION_URLS.SETTINGS, icon: Settings, label: 'Settings', labelKey: 'SETTINGS' },
];
