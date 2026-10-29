import { describe, expect, it } from 'vitest';
import { ManagerDashboardOverviewDataSchema } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/schemas/ManagerDashboardOverviewSchema';

describe('ManagerDashboardOverviewDataSchema', () => {
  it('accepts an explicit empty dashboard response with all required collections present', () => {
    expect(ManagerDashboardOverviewDataSchema.safeParse({ kpiData: [], seatData: [], actionItems: [], recentAdmissions: [], recentEnquiries: [] }).success).toBe(true);
  });

  it('rejects missing required collection fields', () => {
    expect(ManagerDashboardOverviewDataSchema.safeParse({ kpiData: [] }).success).toBe(false);
  });

  it('rejects unknown business states instead of treating them as available', () => {
    const result = ManagerDashboardOverviewDataSchema.safeParse({
      kpiData: [], seatData: [{ id: 'A-1', status: 'mystery' }], actionItems: [], recentAdmissions: [], recentEnquiries: [],
    });
    expect(result.success).toBe(false);
  });

  it('derives presentation classes and destinations from validated business values', () => {
    const result = ManagerDashboardOverviewDataSchema.parse({
      kpiData: [{ title: 'Students', value: 10, trend: '+1%', icon: 'Users', iconClass: 'bg-indigo-500' }],
      seatData: [], actionItems: [{ title: 'Fees due today', count: '3', countClass: 'raw-class', href: 'javascript:alert(1)' }],
      recentAdmissions: [], recentEnquiries: [],
    });
    expect(result.kpiData[0].iconClass).toBe('mgr-kpi-icon--primary');
    expect(result.actionItems[0].countClass).toBe('mgr-badge mgr-badge--danger');
    expect(result.actionItems[0].href).toBe('/frontend_manager/manager_finance/finance_collect_fee');
  });
});
