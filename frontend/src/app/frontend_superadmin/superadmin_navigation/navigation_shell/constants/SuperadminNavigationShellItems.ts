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
 * Ordered strictly per business platform specifications.
 */
export const SUPERADMIN_16_MODULES: SuperadminNavigationItem[] = [
  {
    id: 'dashboard',
    code: '01',
    label: 'Dashboard Overview',
    labelKey: 'COPY.DASHBOARD',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_dashboard,
    icon: LayoutDashboard,
    colorBg: 'rgba(250,204,21,0.15)',
    colorText: '#facc15',
    description: 'Platform health, clients, branches, revenue, subscriptions & alerts',
    subItems: [
      { id: 'health', label: 'Platform Overall Health', href: `${SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}?tab=health` },
      { id: 'clients', label: 'Clients & Libraries Overview', href: `${SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}?tab=clients` },
      { id: 'branches_summary', label: 'Branches Summary', href: `${SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}?tab=branches` },
      { id: 'revenue', label: 'Revenue & Subscriptions', href: `${SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}?tab=revenue` },
      { id: 'alerts', label: 'Critical Platform Alerts', href: `${SUPERADMIN_NAVIGATION_ROUTES.dashboard_overview}?tab=alerts` },
    ],
  },
  {
    id: 'libraries',
    code: '02',
    label: 'Library Account Management',
    labelKey: 'COPY.LIBRARIES',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_libraries,
    icon: Building2,
    colorBg: 'rgba(96,165,250,0.15)',
    colorText: '#60a5fa',
    description: 'Nayi Library Account aur uska Admin Panel create/manage karna',
    subItems: [
      { id: 'lib_list', label: 'All Library Accounts', href: SUPERADMIN_NAVIGATION_ROUTES.libraries_overview },
      { id: 'lib_create', label: 'Create Library Account', href: `${SUPERADMIN_NAVIGATION_ROUTES.libraries_overview}?action=create` },
      { id: 'lib_profile', label: 'Profile & Configuration', href: SUPERADMIN_NAVIGATION_ROUTES.libraries_profile_configuration },
      { id: 'lib_admin_setup', label: 'Admin Panel Provisioning', href: `${SUPERADMIN_NAVIGATION_ROUTES.libraries_overview}?view=admin-setup` },
    ],
  },
  {
    id: 'branches',
    code: '03',
    label: 'Branch Management',
    labelKey: 'COPY.BRANCH_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_branches,
    icon: GitBranch,
    colorBg: 'rgba(74,222,128,0.15)',
    colorText: '#4ade80',
    description: 'Branches create, edit, activate, suspend aur close karna',
    subItems: [
      { id: 'branch_list', label: 'Branches Directory', href: SUPERADMIN_NAVIGATION_ROUTES.branches_overview },
      { id: 'branch_create', label: 'Create New Branch', href: `${SUPERADMIN_NAVIGATION_ROUTES.branches_overview}?action=create` },
      { id: 'branch_edit', label: 'Branch Edit & Details', href: `${SUPERADMIN_NAVIGATION_ROUTES.branches_overview}?action=edit` },
      { id: 'branch_lifecycle', label: 'Activate / Suspend / Close', href: `${SUPERADMIN_NAVIGATION_ROUTES.branches_overview}?tab=lifecycle` },
    ],
  },
  {
    id: 'users',
    code: '04',
    label: 'Admin & User Management',
    labelKey: 'COPY.USERS_ACCESS',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_users,
    icon: Users,
    colorBg: 'rgba(248,113,113,0.15)',
    colorText: '#f87171',
    description: 'Admin login, user invitations, roles, access aur security',
    subItems: [
      { id: 'user_dir', label: 'Admin Users Directory', href: SUPERADMIN_NAVIGATION_ROUTES.users_directory },
      { id: 'user_invites', label: 'User Invitations', href: `${SUPERADMIN_NAVIGATION_ROUTES.users_overview}?tab=invitations` },
      { id: 'roles_perm', label: 'Roles & Permissions', href: SUPERADMIN_NAVIGATION_ROUTES.users_roles_permissions },
      { id: 'account_sec', label: 'Access & Account Security', href: `${SUPERADMIN_NAVIGATION_ROUTES.users_overview}?tab=security` },
    ],
  },
  {
    id: 'plans',
    code: '05',
    label: 'Plans & Subscription',
    labelKey: 'COPY.PLANS',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_plans,
    icon: Tag,
    colorBg: 'rgba(192,132,252,0.15)',
    colorText: '#c084fc',
    description: 'Plans, branch limits, staff limits, modules aur subscription control',
    subItems: [
      { id: 'plan_catalog', label: 'Pricing Plans Catalog', href: SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog },
      { id: 'branch_staff_limits', label: 'Branch & Staff Limits', href: `${SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog}?tab=limits` },
      { id: 'module_limits', label: 'Module Tier Entitlements', href: `${SUPERADMIN_NAVIGATION_ROUTES.plans_pricing_catalog}?tab=modules` },
      { id: 'subs_control', label: 'Active Subscriptions & Renewals', href: SUPERADMIN_NAVIGATION_ROUTES.subscriptions_overview },
    ],
  },
  {
    id: 'billing',
    code: '06',
    label: 'Billing & Payments',
    labelKey: 'COPY.BILLING',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_billing,
    icon: Receipt,
    colorBg: 'rgba(251,191,36,0.15)',
    colorText: '#fbbf24',
    description: 'Invoices, payment collection, GST settings, refunds, outstanding bills',
    subItems: [
      { id: 'bill_inv', label: 'Platform Invoices', href: SUPERADMIN_NAVIGATION_ROUTES.billing_invoices },
      { id: 'bill_collect', label: 'Payment Collection', href: SUPERADMIN_NAVIGATION_ROUTES.billing_overview },
      { id: 'bill_gst', label: 'GST Settings & Taxes', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_overview}?tab=gst` },
      { id: 'bill_refunds', label: 'Refunds & Disputes', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_overview}?tab=refunds` },
      { id: 'bill_out', label: 'Outstanding Bills', href: `${SUPERADMIN_NAVIGATION_ROUTES.billing_invoices}?filter=outstanding` },
    ],
  },
  {
    id: 'features',
    code: '07',
    label: 'Feature & Module Control',
    labelKey: 'COPY.FEATURE_MODULE_CONTROL',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_features,
    icon: Sliders,
    colorBg: 'rgba(52,211,153,0.15)',
    colorText: '#34d399',
    description: 'Books, Members, Seats, Finance, Accounts, Communication enable/disable',
    subItems: [
      { id: 'feat_catalog', label: 'Module Directory & Status', href: SUPERADMIN_NAVIGATION_ROUTES.features_overview },
      { id: 'feat_books', label: 'Books Module Control', href: `${SUPERADMIN_NAVIGATION_ROUTES.features_overview}?module=books` },
      { id: 'feat_members', label: 'Members & Attendance Module', href: `${SUPERADMIN_NAVIGATION_ROUTES.features_overview}?module=members` },
      { id: 'feat_seats', label: 'Seats & Shifts Matrix Module', href: `${SUPERADMIN_NAVIGATION_ROUTES.features_overview}?module=seats` },
      { id: 'feat_finance', label: 'Finance & Accounts Module', href: `${SUPERADMIN_NAVIGATION_ROUTES.features_overview}?module=finance` },
      { id: 'feat_comm', label: 'Communication Module', href: `${SUPERADMIN_NAVIGATION_ROUTES.features_overview}?module=communication` },
    ],
  },
  {
    id: 'usage',
    code: '08',
    label: 'Usage & Limit Monitoring',
    labelKey: 'COPY.USAGE_LIMIT_MONITORING',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_usage,
    icon: Gauge,
    colorBg: 'rgba(56,189,248,0.15)',
    colorText: '#38bdf8',
    description: 'Branches, users, members, storage, messages, API usage',
    subItems: [
      { id: 'use_overview', label: 'Usage Overview & Quotas', href: SUPERADMIN_NAVIGATION_ROUTES.usage_overview },
      { id: 'use_quota_requests', label: 'Branch & Quota Requests', href: SUPERADMIN_NAVIGATION_ROUTES.usage_quota_requests },
      { id: 'use_branches_users', label: 'Branches & Users Limits', href: `${SUPERADMIN_NAVIGATION_ROUTES.usage_overview}?tab=branches-users` },
      { id: 'use_members', label: 'Members & Active Students', href: `${SUPERADMIN_NAVIGATION_ROUTES.usage_overview}?tab=members` },
      { id: 'use_storage', label: 'Storage Consumption', href: `${SUPERADMIN_NAVIGATION_ROUTES.usage_overview}?tab=storage` },
      { id: 'use_msg_api', label: 'Messages & API Usage', href: `${SUPERADMIN_NAVIGATION_ROUTES.usage_overview}?tab=messages-api` },
    ],
  },
  {
    id: 'security',
    code: '09',
    label: 'Security & Audit Logs',
    labelKey: 'COPY.SECURITY_CENTER',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_security,
    icon: ShieldCheck,
    colorBg: 'rgba(239,68,68,0.15)',
    colorText: '#ef4444',
    description: 'Login history, access logs, sensitive actions, suspicious activities',
    subItems: [
      { id: 'sec_login_hist', label: 'Login History & Sessions', href: SUPERADMIN_NAVIGATION_ROUTES.profile_login_history },
      { id: 'sec_audit_logs', label: 'Platform Access & Audit Logs', href: SUPERADMIN_NAVIGATION_ROUTES.audit_logs },
      { id: 'sec_sensitive', label: 'Sensitive Actions Trail', href: `${SUPERADMIN_NAVIGATION_ROUTES.security_overview}?tab=sensitive-actions` },
      { id: 'sec_suspicious', label: 'Suspicious Activities & Threats', href: SUPERADMIN_NAVIGATION_ROUTES.security_threats },
      { id: 'sec_ip_mfa', label: 'IP Firewall & MFA Enforcement', href: SUPERADMIN_NAVIGATION_ROUTES.security_ip_firewall },
    ],
  },
  {
    id: 'analytics',
    code: '10',
    label: 'Reports & Analytics',
    labelKey: 'COPY.ANALYTICS',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_analytics,
    icon: BarChart2,
    colorBg: 'rgba(163,230,53,0.15)',
    colorText: '#a3e635',
    description: 'Business, branch, billing, usage aur platform reports',
    subItems: [
      { id: 'rep_platform', label: 'Platform Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_platform_reports },
      { id: 'rep_billing', label: 'Billing Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_billing_reports },
      { id: 'rep_usage', label: 'Usage Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_usage_reports },
      { id: 'rep_security', label: 'Security Reports', href: SUPERADMIN_NAVIGATION_ROUTES.analytics_security_reports },
    ],
  },
  {
    id: 'support',
    code: '11',
    label: 'Support & Ticket Management',
    labelKey: 'COPY.SUPPORT_TICKETS',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_support,
    icon: HeadphonesIcon,
    colorBg: 'rgba(249,115,22,0.15)',
    colorText: '#fb923c',
    description: 'Library Admin ki complaints, requests, technical support',
    subItems: [
      { id: 'sup_all', label: 'Support Tickets Overview', href: SUPERADMIN_NAVIGATION_ROUTES.support_tickets },
      { id: 'sup_complaints', label: 'Library Admin Complaints', href: `${SUPERADMIN_NAVIGATION_ROUTES.support_tickets}?type=complaint` },
      { id: 'sup_tech', label: 'Technical Support Requests', href: `${SUPERADMIN_NAVIGATION_ROUTES.support_tickets}?type=technical` },
      { id: 'sup_sla', label: 'SLA & Resolution Tracking', href: `${SUPERADMIN_NAVIGATION_ROUTES.support_tickets}?tab=sla` },
    ],
  },
  {
    id: 'notifications',
    code: '12',
    label: 'Notification Management',
    labelKey: 'COPY.COMMUNICATION',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_communication,
    icon: Bell,
    colorBg: 'rgba(34,211,238,0.15)',
    colorText: '#22d3ee',
    description: 'Email, SMS, WhatsApp, payment reminders, announcements',
    subItems: [
      { id: 'notif_announcements', label: 'Platform Announcements', href: SUPERADMIN_NAVIGATION_ROUTES.communication_notices },
      { id: 'notif_email', label: 'Email Notifications & Templates', href: `${SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center}?tab=email` },
      { id: 'notif_sms', label: 'SMS Notifications', href: `${SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center}?tab=sms` },
      { id: 'notif_whatsapp', label: 'WhatsApp Notifications', href: SUPERADMIN_NAVIGATION_ROUTES.communication_whatsapp_integration },
      { id: 'notif_reminders', label: 'Payment Reminders', href: `${SUPERADMIN_NAVIGATION_ROUTES.communication_notification_center}?tab=payment-reminders` },
    ],
  },
  {
    id: 'integrations',
    code: '13',
    label: 'Integration & API Management',
    labelKey: 'COPY.INTEGRATION_API_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_integrations,
    icon: Cable,
    colorBg: 'rgba(167,139,250,0.15)',
    colorText: '#a78bfa',
    description: 'Payment gateways, SMS, WhatsApp, webhooks, APIs',
    subItems: [
      { id: 'int_pg', label: 'Payment Gateways (Razorpay/Stripe)', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=payment-gateways` },
      { id: 'int_sms_wa', label: 'SMS & WhatsApp APIs', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=messaging-apis` },
      { id: 'int_webhooks', label: 'Webhooks & Events', href: `${SUPERADMIN_NAVIGATION_ROUTES.integrations_overview}?tab=webhooks` },
      { id: 'int_api_keys', label: 'API Keys & Developer Access', href: SUPERADMIN_NAVIGATION_ROUTES.security_api_keys },
    ],
  },
  {
    id: 'data',
    code: '14',
    label: 'Data, Backup & Disaster Recovery',
    labelKey: 'COPY.DATA_BACKUP_MANAGEMENT',
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_data,
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
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_system,
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
    href: SUPERADMIN_NAVIGATION_ROUTES.superadmin_settings,
    icon: Settings,
    colorBg: 'rgba(148,163,184,0.15)',
    colorText: '#94a3b8',
    description: 'Platform rules, defaults, permissions, branding aur configuration',
    subItems: [
      { id: 'set_rules', label: 'Platform Rules & Defaults', href: SUPERADMIN_NAVIGATION_ROUTES.settings_general },
      { id: 'set_permissions', label: 'Global Permissions & Policies', href: `${SUPERADMIN_NAVIGATION_ROUTES.settings_general}?tab=permissions` },
      { id: 'set_branding', label: 'Platform Branding & White-label', href: SUPERADMIN_NAVIGATION_ROUTES.settings_branding },
      { id: 'set_maint', label: 'System Maintenance & Mode', href: SUPERADMIN_NAVIGATION_ROUTES.settings_maintenance_mode },
    ],
  },
];

/** Canonical list of primary nav items exported for backward compatibility */
export const SUPERADMIN_NAVIGATION_NAV_ITEMS = SUPERADMIN_16_MODULES;
