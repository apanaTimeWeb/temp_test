import type { Metadata } from 'next';
import '@/app/frontend_manager/manager_dashboard/dashboard_overview/components/manager_dashboard_overview_styles/ManagerDashboardOverviewManager_dashboard.css';

export const metadata: Metadata = {
  title: 'Dashboard Overview | Library OS',
  description: 'Executive overview, branch KPI analytics, operational quick actions, and branch performance metrics',
};

export default function ManagerDashboardOverviewLayout({ children }: { children: React.ReactNode }) {
  return <div className="mgr-dashboard-theme">{children}</div>;
}
