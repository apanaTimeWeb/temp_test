'use client';
// DATA FLOW: dashboard_reports route/container -> this hook or store -> owning module components; state and query updates return through explicit typed callbacks.

import { useMemo, useState } from 'react';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/mocks/AdminDashboardReportsFixtures';
import { ADMIN_DASHBOARD_REPORTS_ANALYTICS_EMPTY_DATA } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/config/admin_dashboard_reports.url_config';
import type { AdminDashboardReportsAnalyticsRange } from '@/app/frontend_admin/admin_dashboard/dashboard_reports/types/AdminDashboardReportsComponentTypes';

export default function useAdminDashboardReportsAnalyticsViewState(isDemoMode: boolean) {
  const [range, setRange] = useState<AdminDashboardReportsAnalyticsRange>('last3Months');
  const [branch, setBranch] = useState('All Branches');
  const data = useMemo(() => isDemoMode ? ADMIN_DASHBOARD_REPORTS_ANALYTICS_FIXTURE : ADMIN_DASHBOARD_REPORTS_ANALYTICS_EMPTY_DATA, [isDemoMode]);
  const branchOptions = useMemo(() => data.branchSummary.map((row) => row.branch), [data.branchSummary]);
  const filteredBranches = useMemo(() => branch === 'All Branches' ? data.branchSummary : data.branchSummary.filter((row) => row.branch === branch), [branch, data.branchSummary]);
  return { range, setRange, branch, setBranch, data, branchOptions, filteredBranches } as const;
}
