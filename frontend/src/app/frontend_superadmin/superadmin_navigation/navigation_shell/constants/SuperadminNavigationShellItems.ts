// RESPONSIBILITY: Define stable module-owned constants for navigation shell; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems.ts -> typed constants -> component/hook/config behavior.
import { BarChart2, Building2, Calculator, CreditCard, DatabaseBackup, HeadphonesIcon, LayoutDashboard, MessageSquare, Receipt, Settings, ShieldAlert, Tag, Users } from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';


/** One primary navigation entry per canonical Superadmin business-domain container. */
export const SUPERADMIN_NAVIGATION_NAV_ITEMS = [
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_dashboard, icon: LayoutDashboard, labelKey: 'COPY.DASHBOARD' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_libraries, icon: Building2, labelKey: 'COPY.LIBRARIES' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_users, icon: Users, labelKey: 'COPY.USERS_ACCESS' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_billing, icon: Receipt, labelKey: 'COPY.BILLING' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_subscriptions, icon: CreditCard, labelKey: 'COPY.SUBSCRIPTIONS' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_plans, icon: Tag, labelKey: 'COPY.PLANS' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_accounting, icon: Calculator, labelKey: 'COPY.ACCOUNTING' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_security, icon: ShieldAlert, labelKey: 'COPY.SECURITY_CENTER' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_analytics, icon: BarChart2, labelKey: 'COPY.ANALYTICS' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_system, icon: DatabaseBackup, labelKey: 'COPY.SYSTEM_HEALTH' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_communication, icon: MessageSquare, labelKey: 'COPY.COMMUNICATION' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_support, icon: HeadphonesIcon, labelKey: 'COPY.SUPPORT_TICKETS' },
  { href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_settings, icon: Settings, labelKey: 'COPY.PLATFORM_SETTINGS' },
] as const;

/**
 * Defines the public SuperadminNavigationItem contract for the Superadmin navigation shell. Optionality and nullability follow the declared fields; no additional backend guarantees are implied.
 */
export type SuperadminNavigationItem = typeof SUPERADMIN_NAVIGATION_NAV_ITEMS[number];
