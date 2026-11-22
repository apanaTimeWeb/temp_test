// RESPONSIBILITY: Define stable module-owned constants for navigation shell; it does not perform I/O or mutate feature state.
// FLOW: Feature consumers -> superadmin_navigation/navigation_shell/constants/SuperadminNavigationShellItems.ts -> typed constants -> component/hook/config behavior.
import {
  BarChart2,
  Bell,
  Building2,
  Cable,
  Database,
  Gauge,
  GitBranch,
  HeadphonesIcon,
  LayoutDashboard,
  Receipt,
  Server,
  Settings,
  ShieldCheck,
  Sliders,
  Tag,
  Users,
} from 'lucide-react';
import { SUPERADMIN_NAVIGATION_ROUTES } from '@/app/frontend_superadmin/superadmin_navigation/navigation_shell/config/superadmin_navigation_routes';

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

/** 
 * Complete 16 SuperAdmin Panel Modules and their constituent features.
 * Ordered strictly per business platform specifications with zero duplicate destinations.
 */
export const SUPERADMIN_16_MODULES: SuperadminNavigationItem[] = [
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
  {
    id: 'security',
    code: '09',
    label: 'Security & Audit Logs',
    labelKey: 'COPY.SECURITY_CENTER',
    href: SUPERADMIN_NAVIGATION_ROUTES.security_overview,
    icon: ShieldCheck,
    colorBg: 'rgba(239,68,68,0.15)',
    colorText: '#ef4444',
    description: 'Login history, access logs, sensitive actions, suspicious activities',
    subItems: [
      { id: 'sec_overview', label: 'Security Dashboard', href: SUPERADMIN_NAVIGATION_ROUTES.security_overview },
      { id: 'sec_threats', label: 'Suspicious Activities & Threats', href: SUPERADMIN_NAVIGATION_ROUTES.security_threats },
      { id: 'sec_ip_firewall', label: 'IP Firewall & Access Rules', href: SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall },
      { id: 'sec_active_sessions', label: 'Active User Sessions', href: SUPERADMIN_NAVIGATION_ROUTES.security_active_sessions },
      { id: 'sec_login_policies', label: 'Login Security & MFA', href: SUPERADMIN_NAVIGATION_ROUTES.security_login_security },
      { id: 'sec_audit_logs', label: 'Platform Audit Trail', href: SUPERADMIN_NAVIGATION_ROUTES.security_audit_logs },
    ],
  },
  {
    id: 'analytics',
    code: '10',
    label: 'Reports & Analytics',
    labelKey: 'COPY.ANALYTICS',
    href: SUPERADMIN_NAVIGATION_ROUTES.analytics_platform_reports,
    icon: BarChart2,
    colorBg: 'rgba(163,230,53,0.15)',
    colorText: '#a3e635',
    description: 'Business, branch, billing, usage aur platform reports',
    subItems: [
      { id: 'rep_platform', label: 'Platform Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_platform_reports },
      { id: 'rep_billing', label: 'Billing & Financial Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports },
      { id: 'rep_usage', label: 'Usage Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports },
      { id: 'rep_security', label: 'Security Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_security_reports },
    ],
  },
  {
    id: 'support',
    code: '11',
    label: 'Support & Ticket Management',
    labelKey: 'COPY.SUPPORT_TICKETS',
    href: SUPERADMIN_NAVIGATION_ROUTES.support_tickets,
    icon: HeadphonesIcon,
    colorBg: 'rgba(249,115,22,0.15)',
    colorText: '#fb923c',
    description: 'Library Admin ki complaints, requests, technical support',
    subItems: [],
  },
  {
    id: 'notifications',
    code: '12',
    label: 'Notification Management',
    labelKey: 'COPY.COMMUNICATION',
    href: SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center,
    icon: Bell,
    colorBg: 'rgba(34,211,238,0.15)',
    colorText: '#22d3ee',
    description: 'Email, SMS, WhatsApp, payment reminders, announcements',
    subItems: [
      { id: 'notif_overview', label: 'Notification Center & Logs', href: SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center },
      { id: 'notif_announcements', label: 'Platform Notices', href: SUPERADMIN_NAVIGATION_ROUTES.communication_notices },
    ],
  },
  {
    id: 'integrations',
    code: '13',
    label: 'Integration & API Management',
    labelKey: 'COPY.INTEGRATION_API_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.integrations_overview,
    icon: Cable,
    colorBg: 'rgba(167,139,250,0.15)',
    colorText: '#a78bfa',
    description: 'Payment gateways, SMS, WhatsApp, webhooks, APIs',
    subItems: [
      { id: 'int_gateways', label: 'Payment Gateways & Providers', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=gateways` },
      { id: 'int_webhooks', label: 'Webhook Subscriptions', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=webhooks` },
      { id: 'int_api_keys', label: 'API Keys & Rate Limits', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=api-keys` },
      { id: 'int_logs', label: 'Integration Logs & Events', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=logs` },
      { id: 'int_entitlements', label: 'Plan Entitlements', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=entitlements` },
    ],
  },
  {
    id: 'data',
    code: '14',
    label: 'Data, Backup & Disaster Recovery',
    labelKey: 'COPY.DATA_BACKUP_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.data_overview,
    icon: Database,
    colorBg: 'rgba(244,114,182,0.15)',
    colorText: '#f472b6',
    description: 'RPO/RTO monitoring, automated backups, restore testing, tenant isolation, migration & retention',
    subItems: [
      { id: 'data_overview', label: 'Disaster Recovery Cockpit', href: SUPERADMIN_NAVIGATION_ROUTES.data_overview },
      { id: 'data_backup', label: 'Backup Schedules & Policies', href: SUPERADMIN_NAVIGATION_ROUTES.data_backup_operations },
      { id: 'data_restore', label: 'Restore & Sandbox Drills', href: SUPERADMIN_NAVIGATION_ROUTES.data_restore_operations },
      { id: 'data_export', label: 'Tenant & Branch Exports', href: SUPERADMIN_NAVIGATION_ROUTES.data_export_management },
      { id: 'data_import', label: 'Data Import & Migration', href: SUPERADMIN_NAVIGATION_ROUTES.data_import_migration },
      { id: 'data_retention', label: 'Archive & Retention Rules', href: SUPERADMIN_NAVIGATION_ROUTES.data_archive_retention },
    ],
  },
  {
    id: 'system',
    code: '15',
    label: 'System Health & Monitoring',
    labelKey: 'COPY.SYSTEM_HEALTH',
    href: SUPERADMIN_NAVIGATION_ROUTES.system_health_overview,
    icon: Server,
    colorBg: 'rgba(45,212,191,0.15)',
    colorText: '#2dd4bf',
    description: 'Server, database, API, queue, error aur uptime monitoring',
    subItems: [
      { id: 'sys_server', label: 'Server & Application Status', href: `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=server` },
      { id: 'sys_db', label: 'Database & Storage Capacity', href: `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=database` },
      { id: 'sys_api_queue', label: 'API, Webhooks & Queues', href: `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=queues` },
      { id: 'sys_security_maintenance', label: 'Security Alerts & Maintenance', href: `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=security` },
      { id: 'sys_releases', label: 'Releases & Feature Controls', href: `${SUPERADMIN_NAVIGATION_ROUTES.system_health_overview}?tab=releases` },
    ],
  },
  {
    id: 'settings',
    code: '16',
    label: 'Global Settings',
    labelKey: 'COPY.PLATFORM_SETTINGS',
    href: SUPERADMIN_NAVIGATION_ROUTES.settings_general,
    icon: Settings,
    colorBg: 'rgba(148,163,184,0.15)',
    colorText: '#94a3b8',
    description: 'Platform rules, defaults, permissions, branding aur configuration',
    subItems: [
      { id: 'set_rules', label: 'Platform Rules & Defaults', href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
      { id: 'set_tax_gst', label: 'GST & Legal Tax Configuration', href: `${SUPERADMIN_NAVIGATION_ROUTES.settings_general}?section=gst_tax` },
      { id: 'set_branding', label: 'Platform Branding & White-label', href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
      { id: 'set_library_defaults', label: 'Library Configuration Defaults', href: SUPERADMIN_NAVIGATION_ROUTES.settings_library_configuration },
    ],
  },
];

/** Canonical list of primary nav items exported for backward compatibility */
export const SUPERADMIN_NAVIGATION_NAV_ITEMS = SUPERADMIN_16_MODULES;
