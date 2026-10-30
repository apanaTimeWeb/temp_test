import { apiFetch } from '@/lib/api';
import { parseApiResponseData } from '@/lib/apiSchema';
import { ADMIN_DASHBOARD_REPORTS_API } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import { AdminDashboardReportsAnalyticsApiResponseSchema } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/schemas/AdminDashboardReportsAnalyticsApiSchema';
import type { AdminDashboardReportsAnalyticsApiRecord } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

/** Typed feature-owned transport boundary. The supplied scope does not define the full backend response contract. */
export async function fetchAdminDashboardReportsAnalytics(): Promise<AdminDashboardReportsAnalyticsApiRecord[]> {
  const payload = await apiFetch<unknown>(ADMIN_DASHBOARD_REPORTS_API.LIST);
  return parseApiResponseData(payload, AdminDashboardReportsAnalyticsApiResponseSchema);
}


