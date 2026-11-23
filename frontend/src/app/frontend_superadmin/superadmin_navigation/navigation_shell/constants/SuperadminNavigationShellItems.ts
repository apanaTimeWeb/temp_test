// RESPONSIBILITY: Define stable module-owned constants for navigation shell; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems.ts -> typed constants -> component/hook/config behavior.
import {
  Building2,
  Gauge,
  GitBranch,
  LayoutDashboard,
  Receipt,
  Sliders,
  Tag,
  Users,
} from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';
import { SUPERADMIN_SECONDARY_MODULES } from './SuperadminNavigationShellItemsSecondary';

export interface SuperadminNavSubItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface SuperadminNavigationItem {
  id: string;
  code: string; // '01' through '16'
  label: string;
  labelKey: string;
  href: string;
  icon: typeof LayoutDashboard;
  colorBg: string;
  colorText: string;
  description: string;
  subItems: SuperadminNavSubItem[];
}

const SUPERADMIN_PRIMARY_MODULES: SuperadminNavigationItem[] = [
  {
    id: 'dashboard',
    code: '01',
    label: 'Dashboard Overview',
    labelKey: 'COPY.DASHBOARD',
    href: SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview,
    icon: LayoutDashboard,
    colorBg: 'rgba(250,204,21,0.15)',
    colorText: '#facc15',
    description: 'Platform health, clients, branches, revenue, subscriptions & alerts',
    subItems: [],
  },
  {
    id: 'libraries',
    code: '02',
    label: 'Library Account Management',
    labelKey: 'COPY.LIBRARIES',
    href: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview,
    icon: Building2,
    colorBg: 'rgba(96,165,250,0.15)',
    colorText: '#60a5fa',
    description: 'Nayi Library Account aur uska Admin Panel create/manage karna',
    subItems: [
      { id: 'lib_list', label: 'All Library Accounts', href: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview },
      { id: 'lib_profile', label: 'Profile & Configuration', href: SUPERADMIN_NAVIGATION_ROUTES.libraries_profile_configuration },
      { id: 'lib_onboarding', label: 'Onboarding & Admin Setup', href: SUPERADMIN_NAVIGATION_ROUTES.libraries_onboarding_setup },
    ],
  },
  {
    id: 'branches',
    code: '03',
    label: 'Branch Management',
    labelKey: 'COPY.BRANCH_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.branches_overview,
    icon: GitBranch,
    colorBg: 'rgba(74,222,128,0.15)',
    colorText: '#4ade80',
    description: 'Branches create, edit, activate, suspend aur close karna',
    subItems: [],
  },
  {
    id: 'users',
    code: '04',
    label: 'Admin & User Management',
    labelKey: 'COPY.USERS_ACCESS',
    href: SUPERADMIN_NAVIGATION_ROUTES.users_directory,
    icon: Users,
    colorBg: 'rgba(248,113,113,0.15)',
    colorText: '#f87171',
    description: 'Admin login, user invitations, roles, access aur security',
    subItems: [
      { id: 'user_dir', label: 'Admin Users Directory', href: SUPERADMIN_NAVIGATION_ROUTES.users_directory },
      { id: 'roles_perm', label: 'Roles & Permissions Matrix', href: SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions },
      { id: 'users_overview', label: 'User Operations & Analytics', href: SUPERADMIN_NAVIGATION_ROUTES.users_overview },
    ],
  },
  {
    id: 'plans',
    code: '05',
    label: 'Plans & Subscription',
    labelKey: 'COPY.PLANS',
    href: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog,
    icon: Tag,
    colorBg: 'rgba(192,132,252,0.15)',
    colorText: '#c084fc',
    description: 'Plans, branch limits, staff limits, modules aur subscription control',
    subItems: [
      { id: 'plan_catalog', label: 'Pricing Plans Catalog', href: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog },
      { id: 'plan_promotions', label: 'Promotions & Coupons', href: SUPERADMIN_NAVIGATION_ROUTES.plans_promotions },
      { id: 'subs_overview', label: 'Active Subscriptions', href: SUPERADMIN_NAVIGATION_ROUTES.subscriptions_overview },
      { id: 'subs_registry', label: 'Subscribers Registry', href: SUPERADMIN_NAVIGATION_ROUTES.subscriptions_active_subscribers },
    ],
  },
  {
    id: 'billing',
    code: '06',
    label: 'Billing & Payments',
    labelKey: 'COPY.BILLING',
    href: SUPERADMIN_NAVIGATION_ROUTES.billing_invoices,
    icon: Receipt,
    colorBg: 'rgba(251,191,36,0.15)',
    colorText: '#fbbf24',
    description: 'Invoices, payment collection, GST settings, refunds, outstanding bills',
    subItems: [
      { id: 'bill_invoices', label: 'Tax Invoices & Billing', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}?tab=invoices` },
      { id: 'bill_transactions', label: 'Transactions & Ledger', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}?tab=transactions` },
      { id: 'bill_reports', label: 'Outstanding & Revenue', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}?tab=reports` },
    ],
  },
  {
    id: 'features',
    code: '07',
    label: 'Feature & Module Control',
    labelKey: 'COPY.FEATURE_MODULE_CONTROL',
    href: SUPERADMIN_NAVIGATION_ROUTES.features_overview,
    icon: Sliders,
    colorBg: 'rgba(52,211,153,0.15)',
    colorText: '#34d399',
    description: 'Lockers, Members, Seats, Finance, Accounts, Communication enable/disable',
    subItems: [],
  },
  {
    id: 'usage',
    code: '08',
    label: 'Usage & Limit Monitoring',
    labelKey: 'COPY.USAGE_LIMIT_MONITORING',
    href: SUPERADMIN_NAVIGATION_ROUTES.usage_overview,
    icon: Gauge,
    colorBg: 'rgba(56,189,248,0.15)',
    colorText: '#38bdf8',
    description: 'Branches, users, members, storage, messages, API usage',
    subItems: [
      { id: 'use_overview', label: 'Usage Overview & Quotas', href: SUPERADMIN_NAVIGATION_ROUTES.usage_overview },
      { id: 'use_quota_requests', label: 'Branch & Quota Requests', href: SUPERADMIN_NAVIGATION_ROUTES.usage_quota_requests },
    ],
  },
];

/** 
 * Complete 16 SuperAdmin Panel Modules and their constituent features.
 * Ordered strictly per business platform specifications with zero duplicate destinations.
 */
export const SUPERADMIN_16_MODULES: SuperadminNavigationItem[] = [
  ...SUPERADMIN_PRIMARY_MODULES,
  ...SUPERADMIN_SECONDARY_MODULES,
];

/** Canonical list of primary nav items exported for backward compatibility */
export const SUPERADMIN_NAVIGATION_NAV_ITEMS = SUPERADMIN_16_MODULES;
