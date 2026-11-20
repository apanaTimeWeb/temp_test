'use client';
import SuperadminSystemHealthOverviewNetworkMetrics from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewNetworkMetrics';
import SuperadminSystemHealthOverviewInfrastructure from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewInfrastructure';
import SuperadminSystemHealthOverviewIntegrations from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewIntegrations';
import SuperadminSystemHealthOverviewServicesTable from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewServicesTable';

interface DashboardSectionsProps {
  refreshTrigger?: number;
}

export default function SuperadminSystemHealthOverviewDashboardSections({
  refreshTrigger = 0,
}: DashboardSectionsProps) {
  return (
    <>
      <SuperadminSystemHealthOverviewNetworkMetrics refreshTrigger={refreshTrigger} />
      <SuperadminSystemHealthOverviewServicesTable />
      <SuperadminSystemHealthOverviewInfrastructure />
      <SuperadminSystemHealthOverviewIntegrations />
    </>
  );
}
