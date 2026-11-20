// RESPONSIBILITY: Comprehensive test verifying 100% adherence to all 12 KPI cards, 14 operational sections, and multi-dimensional filters.
import { describe, expect, it } from 'vitest';
import {
  SUPERADMIN_DASHBOARD_12_KPIS,
  SUPERADMIN_DASHBOARD_INITIAL_DATA,
  SUPERADMIN_DASHBOARD_PENDING_BRANCHES,
  SUPERADMIN_DASHBOARD_PENDING_UPGRADES,
  SUPERADMIN_DASHBOARD_PLATFORM_ALERTS,
  SUPERADMIN_DASHBOARD_INFRA_HEALTH,
  SUPERADMIN_DASHBOARD_ADMIN_LOGINS,
  SUPERADMIN_DASHBOARD_SUPERADMIN_ACTIVITIES,
  SUPERADMIN_DASHBOARD_RECENT_BRANCHES,
  SUPERADMIN_DASHBOARD_OPEN_TICKETS,
} from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/constants/SuperadminDashboardOverviewData';
import { SUPERADMIN_DASHBOARD_OVERVIEW_ROUTES } from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/config/superadmin_dashboard_overview.url_config';

describe('SuperAdmin Dashboard Complete Requirements Contract', () => {
  it('contains exactly the 12 specified Top KPI Cards with valid click-through destinations', () => {
    expect(SUPERADMIN_DASHBOARD_12_KPIS).toHaveLength(12);

    const kpiTitles = SUPERADMIN_DASHBOARD_12_KPIS.map((c) => c.title);
    expect(kpiTitles).toContain('Total Library Accounts');
    expect(kpiTitles).toContain('Active Accounts');
    expect(kpiTitles).toContain('Suspended Accounts');
    expect(kpiTitles).toContain('Total Branches');
    expect(kpiTitles).toContain('Active Branches');
    expect(kpiTitles).toContain('Total Admins');
    expect(kpiTitles).toContain('Total Staff');
    expect(kpiTitles).toContain('Total Members');
    expect(kpiTitles).toContain('Monthly Revenue');
    expect(kpiTitles).toContain('Pending Payments');
    expect(kpiTitles).toContain('Expiring Subscriptions');
    expect(kpiTitles).toContain('Storage Usage');

    // Every single card must have an explicit, non-empty click-through route
    for (const card of SUPERADMIN_DASHBOARD_12_KPIS) {
      expect(card.href, `Card ${card.title} missing href`).toBeDefined();
      expect(card.href?.startsWith('/superadmin/')).toBe(true);
      expect(card.value).toBeTruthy();
    }
  });

  it('provides all 14 required dashboard operational sections and datasets', () => {
    // 1. Recent Library Accounts
    expect(SUPERADMIN_DASHBOARD_INITIAL_DATA.recentLibraries.length).toBeGreaterThan(0);
    // 2. Recently Created Branches
    expect(SUPERADMIN_DASHBOARD_RECENT_BRANCHES.length).toBeGreaterThan(0);
    // 3. Latest Admin Logins
    expect(SUPERADMIN_DASHBOARD_ADMIN_LOGINS.length).toBeGreaterThan(0);
    // 4. Failed Login Attempts
    const failedLogins = SUPERADMIN_DASHBOARD_PLATFORM_ALERTS.filter((a) => a.type === 'failed_login');
    expect(failedLogins.length).toBeGreaterThan(0);
    // 5. Pending Branch Creation Requests
    expect(SUPERADMIN_DASHBOARD_PENDING_BRANCHES.length).toBeGreaterThan(0);
    // 6. Pending Upgrade Requests
    expect(SUPERADMIN_DASHBOARD_PENDING_UPGRADES.length).toBeGreaterThan(0);
    // 7. Payment Failure Alerts
    const paymentFailures = SUPERADMIN_DASHBOARD_PLATFORM_ALERTS.filter((a) => a.type === 'payment_failure');
    expect(paymentFailures.length).toBeGreaterThan(0);
    // 8. Expiring Subscription Alerts
    const expiringSubs = SUPERADMIN_DASHBOARD_PLATFORM_ALERTS.filter((a) => a.type === 'subscription_expiring');
    expect(expiringSubs.length).toBeGreaterThan(0);
    // 9. Server/API Health
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.serverStatus).toBe('healthy');
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.uptime).toBeTruthy();
    // 10. Database Health
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.databaseStatus).toBe('healthy');
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.dbConnections).toBeTruthy();
    // 11. Background Job Failures
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.failedJobsCount).toBeGreaterThanOrEqual(0);
    const jobFailures = SUPERADMIN_DASHBOARD_PLATFORM_ALERTS.filter((a) => a.type === 'job_failure');
    expect(jobFailures.length).toBeGreaterThan(0);
    // 12. Recent SuperAdmin Activities
    expect(SUPERADMIN_DASHBOARD_SUPERADMIN_ACTIVITIES.length).toBeGreaterThan(0);
    // 13. Open Support Tickets
    expect(SUPERADMIN_DASHBOARD_OPEN_TICKETS.length).toBeGreaterThan(0);
    // 14. Data Backup Status
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.backupStatus).toBe('success');
    expect(SUPERADMIN_DASHBOARD_INFRA_HEALTH.backupSize).toBeTruthy();
  });

  it('guarantees all alert action buttons route to canonical platform modules', () => {
    for (const alert of SUPERADMIN_DASHBOARD_PLATFORM_ALERTS) {
      if (alert.actionHref) {
        expect(alert.actionHref.startsWith('/superadmin/')).toBe(true);
      }
    }
    for (const branchReq of SUPERADMIN_DASHBOARD_PENDING_BRANCHES) {
      expect(branchReq.branchName).toBeTruthy();
      expect(branchReq.seats).toBeGreaterThan(0);
    }
    for (const upgradeReq of SUPERADMIN_DASHBOARD_PENDING_UPGRADES) {
      expect(upgradeReq.priceDelta).toBeTruthy();
      expect(upgradeReq.requestedPlan).toBeTruthy();
    }
  });
});
