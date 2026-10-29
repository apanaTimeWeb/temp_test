import '@/app/frontend_manager/manager_dashboard/dashboard_reports/components/manager_dashboard_reports_styles/ManagerDashboardReportsManager_reports.css';

export default function ManagerDashboardReportsLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-reports-theme">{children}</div>;
}
