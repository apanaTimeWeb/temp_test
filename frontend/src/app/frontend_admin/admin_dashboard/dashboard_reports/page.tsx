import AdminDashboardReportsAnalyticsPanel from '@/app/frontend_admin/admin_dashboard/dashboard_reports/components/AdminDashboardReportsAnalyticsPanel';

export type AdminDashboardReportsLibraryView = 'analytics' | 'library';

/** Canonical Server Component route entry for Admin Reports & Analytics. */
export default function AdminDashboardReportsRoute() {
  return (
    <div className="w-full space-y-6 text-text-primary">
      <AdminDashboardReportsAnalyticsPanel />
    </div>
  );
}
