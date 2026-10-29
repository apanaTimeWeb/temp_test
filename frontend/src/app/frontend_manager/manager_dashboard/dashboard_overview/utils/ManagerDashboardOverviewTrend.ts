import type { ManagerDashboardOverviewTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_overview/types/ManagerDashboardOverviewComponentTypes';
export type { ManagerDashboardOverviewTrendTone };
/** Classifies the displayed trend sign without assuming whether a KPI increase is desirable. */


export function getManagerDashboardTrendTone(trend: string): ManagerDashboardOverviewTrendTone {
  const normalized = trend.trim();
  if (/^[+＋]/u.test(normalized)) return 'up';
  if (/^[-−]/u.test(normalized)) return 'down';
  return 'neutral';
}
