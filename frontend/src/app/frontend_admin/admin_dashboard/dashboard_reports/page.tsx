'use client';
// RESPONSIBILITY: Canonical single route for dashboard reports and analytics (AdminDashboardReportsLibrary).
// Note: 'analytics' | 'library' unified into executive analytics panel; REPORTS_DATA_PENDING handled at data boundary.

import AdminDashboardReportsAnalyticsPanel from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPanel';

export type AdminDashboardReportsLibraryView = 'analytics' | 'library';

/**
 * Renders the executive Reports & Analytics view for the Admin panel.
 * Streamlined to focus strictly on real analytics: KPIs, revenue trends, occupancy,
 * student growth, and comparative branch summaries.
 */
export default function AdminDashboardReportsRoute() {
  return (
    <div className="w-full space-y-6 text-text-primary">
      <AdminDashboardReportsAnalyticsPanel />
    </div>
  );
}
