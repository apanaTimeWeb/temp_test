// RESPONSIBILITY: Provide stable baseline operational telemetry and workflow data constants for dashboard overview.
import type {
  SuperadminDashboardPendingBranchRequest,
  SuperadminDashboardPendingUpgradeRequest,
  SuperadminDashboardPlatformAlert,
  SuperadminDashboardInfrastructureHealthExtended,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

export const SUPERADMIN_DASHBOARD_PENDING_BRANCHES: SuperadminDashboardPendingBranchRequest[] = [
  {
    id: 'req-br-1',
    libraryName: 'Gyan Ganga Study Hub',
    libraryId: 'lib-002',
    branchName: 'Civil Lines Branch',
    city: 'Prayagraj',
    seats: 120,
    requestedAt: '3 hours ago',
    status: 'pending',
  },
  {
    id: 'req-br-2',
    libraryName: 'Apex Library Chain',
    libraryId: 'lib-001',
    branchName: 'South Extension Branch',
    city: 'New Delhi',
    seats: 250,
    requestedAt: '1 day ago',
    status: 'reviewing',
  },
  {
    id: 'req-br-3',
    libraryName: 'Central Reading Spaces',
    libraryId: 'lib-003',
    branchName: 'Kothrud Campus Branch',
    city: 'Pune',
    seats: 180,
    requestedAt: '2 days ago',
    status: 'pending',
  },
];

export const SUPERADMIN_DASHBOARD_PENDING_UPGRADES: SuperadminDashboardPendingUpgradeRequest[] = [
  {
    id: 'req-up-1',
    libraryName: 'Central Reading Spaces',
    libraryId: 'lib-003',
    currentPlan: 'Pro',
    requestedPlan: 'Enterprise Tier 2',
    priceDelta: '+₹8,500/mo',
    requestedAt: '4 hours ago',
    status: 'pending',
  },
  {
    id: 'req-up-2',
    libraryName: 'Vidya Jyoti Library',
    libraryId: 'lib-008',
    currentPlan: 'Starter',
    requestedPlan: 'Pro Annual',
    priceDelta: '+₹4,200/mo',
    requestedAt: '1 day ago',
    status: 'pending',
  },
  {
    id: 'req-up-3',
    libraryName: 'Apex Library Chain',
    libraryId: 'lib-001',
    currentPlan: 'Enterprise',
    requestedPlan: 'Custom Unlimited',
    priceDelta: '+₹15,000/mo',
    requestedAt: '3 days ago',
    status: 'pending',
  },
];

export const SUPERADMIN_DASHBOARD_PLATFORM_ALERTS: SuperadminDashboardPlatformAlert[] = [
  {
    id: 'alert-1',
    type: 'payment_failure',
    severity: 'critical',
    title: 'Payment Gateway Auto-Debit Failed',
    description: 'Invoice #INV-2026-9812 for Apex Library bounced via Razorpay ACH.',
    timestamp: '25 mins ago',
    entityName: 'Apex Library Chain',
    amount: '₹14,999',
    actionLabel: 'Retry Payment',
    actionHref: SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BILLING,
  },
  {
    id: 'alert-2',
    type: 'subscription_expiring',
    severity: 'warning',
    title: 'Subscription Expiring in 48 Hours',
    description: 'Heritage Reading Lounge Pro Plan expires on 22 Nov 2026 without auto-renewal.',
    timestamp: '1 hour ago',
    entityName: 'Heritage Reading Lounge',
    amount: '₹6,499',
    actionLabel: 'Send Reminder',
    actionHref: SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUBSCRIPTIONS,
  },
  {
    id: 'alert-3',
    type: 'failed_login',
    severity: 'high',
    title: 'Brute Force Anomaly: 8 Failed Logins',
    description: 'Repeated bad password attempts from IP 185.220.101.5 on admin@gyanganga.com.',
    timestamp: '2 hours ago',
    entityName: 'admin@gyanganga.com',
    actionLabel: 'Block IP in Firewall',
    actionHref: SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SECURITY,
  },
  {
    id: 'alert-4',
    type: 'job_failure',
    severity: 'warning',
    title: 'Background Queue Job Exception',
    description: 'Daily automated PDF invoice dispatch queue failed 3 items due to SMTP rate limit.',
    timestamp: '3 hours ago',
    entityName: 'Worker-Queue #invoice-dispatcher',
    actionLabel: 'Re-queue Failed Tasks',
    actionHref: SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SYSTEM_HEALTH,
  },
];

export const SUPERADMIN_DASHBOARD_INFRA_HEALTH: SuperadminDashboardInfrastructureHealthExtended = {
  uptime: '99.98%',
  activeUsers: 248,
  apiLatency: '68ms',
  lastBackup: '52 mins ago',
  serverStatus: 'healthy',
  apiErrorRate: '0.02%',
  databaseStatus: 'healthy',
  dbConnections: '42 / 200 (21%)',
  dbReadLatency: '2.4ms',
  dbWriteLatency: '6.8ms',
  backupSize: '4.8 GB Encrypted',
  backupStatus: 'success',
  failedJobsCount: 3,
};

// Re-export activity records for unified accessibility
export {
  SUPERADMIN_DASHBOARD_ADMIN_LOGINS,
  SUPERADMIN_DASHBOARD_SUPERADMIN_ACTIVITIES,
  SUPERADMIN_DASHBOARD_RECENT_BRANCHES,
  SUPERADMIN_DASHBOARD_OPEN_TICKETS,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewOperationalActivityData';
