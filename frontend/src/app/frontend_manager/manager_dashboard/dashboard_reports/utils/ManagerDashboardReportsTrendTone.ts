import type { ManagerDashboardReportsTrendTone } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsComponentTypes';
export type { ManagerDashboardReportsTrendTone };


/** Only explicit signed values carry direction; unsigned labels remain neutral. */
export function getManagerReportsTrendTone(value: string): ManagerDashboardReportsTrendTone {
  const normalized = value.trim();
  if (normalized.startsWith('-')) return 'down';
  if (normalized.startsWith('+')) return 'up';
  return 'neutral';
}
