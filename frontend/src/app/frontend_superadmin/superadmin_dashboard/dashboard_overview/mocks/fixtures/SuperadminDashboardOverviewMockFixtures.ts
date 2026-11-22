// FLOW: Feature preview/test -> superadmin_dashboard/dashboard_overview/mocks/fixtures/SuperadminDashboardOverviewMockFixtures.ts -> typed local fixtures -> screen rendering or assertions.
/** Responsibility: Superadmin Dashboard Fixtures; supplies module-owned mock fixtures or handler behavior only. */
import type { SuperadminDashboardDataResponse, SuperadminDashboardRecentActivityItem } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/types/SuperadminDashboardOverviewTypes';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES as __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from "@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config";

// ── Frontend-only Mock Data (no backend required) ────────────────────────────
const MOCK_DASHBOARD_DATA: SuperadminDashboardDataResponse = {
  kpiCards: [
    {
      title: 'Total Libraries', titleKey: 'COPY.TOTAL_LIBRARIES',
      value: '2,418',
      icon: 'store',
      subtitle: '+12 this month', subtitleKey: 'COPY.PLUS_12_THIS_MONTH',
      trend: '+0.5%',
      progress: 72,
    },
    {
      title: 'Active Members', titleKey: 'COPY.ACTIVE_MEMBERS',
      value: '5,12,340',
      icon: 'groups',
      subtitle: '+1,240 this week', subtitleKey: 'COPY.PLUS_1240_THIS_WEEK',
      trend: '+2.4%',
      progress: 85,
    },
    {
      title: 'Monthly Revenue', titleKey: 'COPY.MONTHLY_REVENUE',
      value: '',
      valueMinor: 438000000, currencyCode: 'INR',
      icon: 'currency_rupee',
      subtitle: '', subtitleKey: 'COPY.REVENUE_LAST_MONTH', subtitleAmountMinor: 382000000, subtitleCurrencyCode: 'INR',
      trend: '+14.7%',
      progress: 91,
    },
    {
      title: 'Open Tickets', titleKey: 'COPY.OPEN_TICKETS',
      value: '7',
      icon: 'pending_actions',
      subtitle: '3 critical', subtitleKey: 'COPY.THREE_CRITICAL',
      alert: 'Needs attention', alertKey: 'COPY.NEEDS_ATTENTION',
      progress: 30,
    },
  ],
  systemHealth: {
    uptime: '99.97%',
    activeUsers: 3241,
    apiLatency: '82ms',
    lastBackup: '2 hours ago',
  },
  actionItems: [
    {
      id: 'ai-1',
      title: 'Subscription Renewal Pending', titleKey: 'COPY.SUBSCRIPTION_RENEWAL_PENDING',
      description: 'Demo Library B — sample balance overdue',
      type: 'warning',
      icon: '⚠️',
      actionLabel: 'Review', actionLabelKey: 'COPY.REVIEW',
      actionUrl: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUBSCRIPTIONS,
    },
    {
      id: 'ai-2',
      title: 'Critical Support Ticket', titleKey: 'COPY.CRITICAL_SUPPORT_TICKET',
      description: 'SAMPLE-TKT-002 — demo payment issue',
      type: 'error',
      icon: '🔴',
      actionLabel: 'Resolve', actionLabelKey: 'COPY.RESOLVE',
      actionUrl: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUPPORT_TICKETS,
    },
    {
      id: 'ai-3',
      title: 'New Library Onboarding', titleKey: 'COPY.NEW_LIBRARY_ONBOARDING',
      description: 'Demo Library A — sample setup preview pending',
      type: 'info',
      icon: '🔵',
      actionLabel: 'Guide', actionLabelKey: 'COPY.GUIDE',
      actionUrl: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES,
    },
  ],
  recentLibraries: [
    {
      initials: 'SN',
      name: 'Demo Library A',
      owner: 'Sample Owner A',
      students: 0,
      status: 'setup',
      plan: 'Pro',
      joinedAt: '2 hours ago',
    },
    {
      initials: 'AL',
      name: 'Demo Library B',
      owner: 'Sample Owner B',
      students: 1240,
      status: 'active',
      plan: 'Enterprise',
      joinedAt: '3 days ago',
    },
    {
      initials: 'SS',
      name: 'Demo Library C',
      owner: 'Sample Owner C',
      students: 890,
      status: 'inactive',
      plan: 'Starter',
      joinedAt: '1 week ago',
    },
    {
      initials: 'GK',
      name: 'Demo Library D',
      owner: 'Sample Owner D',
      students: 560,
      status: 'active',
      plan: 'Pro',
      joinedAt: '2 weeks ago',
    },
    {
      initials: 'CR',
      name: 'Demo Library E',
      owner: 'Sample Owner E',
      students: 2100,
      status: 'active',
      plan: 'Enterprise',
      joinedAt: '1 month ago',
    },
  ],
};

export const SUPERADMIN_DASHBOARD_FIXTURE: SuperadminDashboardDataResponse = MOCK_DASHBOARD_DATA;

/** Synthetic activity rows displayed only in the sample dashboard preview. */
export const SUPERADMIN_DASHBOARD_RECENT_ACTIVITY_FIXTURE: SuperadminDashboardRecentActivityItem[] = [
  { id: 'sample-activity-1', dotCls: 'sa-recent-activity-dot--success', title: 'Sample: Library Registered', titleKey: 'COPY.SAMPLE_LIBRARY_REGISTERED', description: 'Demo Library A — Sample Plan', descriptionKey: 'COPY.DEMO_LIBRARY_A_SAMPLE_PLAN', timeLabel: '2 hours ago', timeLabelKey: 'COPY.TWO_HOURS_AGO', href: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.LIBRARIES },
  { id: 'sample-activity-2', dotCls: 'sa-recent-activity-dot--danger', title: 'Sample: Subscription Overdue', titleKey: 'COPY.SAMPLE_SUBSCRIPTION_OVERDUE', description: 'Demo Library B — sample balance only', descriptionKey: 'COPY.DEMO_LIBRARY_B_SAMPLE_BALANCE_ONLY', timeLabel: '5 hours ago', timeLabelKey: 'COPY.FIVE_HOURS_AGO', href: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUBSCRIPTIONS },
  { id: 'sample-activity-3', dotCls: 'sa-recent-activity-dot--warning', title: 'Sample: Support Ticket Opened', titleKey: 'COPY.SAMPLE_SUPPORT_TICKET_OPENED', description: 'SAMPLE-TKT-001 — demo issue', descriptionKey: 'COPY.SAMPLE_TKT_001_DEMO_ISSUE', timeLabel: '1 day ago', timeLabelKey: 'COPY.ONE_DAY_AGO', href: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SUPPORT_TICKETS },
  { id: 'sample-activity-4', dotCls: 'sa-recent-activity-dot--info', title: 'Sample: Backup Event', titleKey: 'COPY.SAMPLE_BACKUP_EVENT', description: 'Demo snapshot — storage not connected', descriptionKey: 'COPY.DEMO_SNAPSHOT_STORAGE_NOT_CONNECTED', timeLabel: '2 days ago', timeLabelKey: 'COPY.TWO_DAYS_AGO', href: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.SYSTEM_HEALTH },
  { id: 'sample-activity-5', dotCls: 'sa-recent-activity-dot--success', title: 'Sample: Plan Renewed', titleKey: 'COPY.SAMPLE_PLAN_RENEWED', description: 'Demo Library C — sample plan only', descriptionKey: 'COPY.DEMO_LIBRARY_C_SAMPLE_PLAN_ONLY', timeLabel: '3 days ago', timeLabelKey: 'COPY.THREE_DAYS_AGO', href: __SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES.MODULE_URLS.BILLING },
];
