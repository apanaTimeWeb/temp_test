import '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_styles/ManagerDashboardOverviewManager_dashboard.css';

export default function ManagerDashboardOverviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-dashboard-theme">{children}</div>;
}
