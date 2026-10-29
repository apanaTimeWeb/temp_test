import type { ManagerDashboardReportsDateRange } from '@/app/frontend_manager/manager_dashboard/dashboard_reports/types/ManagerDashboardReportsTypes';
export const getManagerReportsQueryKey = (dateRange:ManagerDashboardReportsDateRange) => ['manager_reports','reports',dateRange] as const;
