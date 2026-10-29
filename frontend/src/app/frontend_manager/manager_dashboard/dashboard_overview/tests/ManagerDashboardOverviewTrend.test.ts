import { describe, expect, it } from 'vitest';
import { getManagerDashboardTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/utils/ManagerDashboardOverviewTrend';

describe('getManagerDashboardTrendTone', () => {
  it('classifies signed positive and negative trends', () => {
    expect(getManagerDashboardTrendTone('+6.2%')).toBe('up');
    expect(getManagerDashboardTrendTone('-2.1%')).toBe('down');
    expect(getManagerDashboardTrendTone('−1.0%')).toBe('down');
  });

  it('uses neutral styling when a trend has no explicit sign', () => {
    expect(getManagerDashboardTrendTone('Stable')).toBe('neutral');
    expect(getManagerDashboardTrendTone('  ')).toBe('neutral');
  });
});
