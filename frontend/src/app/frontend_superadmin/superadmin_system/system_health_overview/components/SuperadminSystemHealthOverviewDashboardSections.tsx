/** Responsibility: Superadmin System Health Dashboard Sections; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewDashboardSections formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import SuperadminSystemHealthOverviewNetworkMetrics from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewNetworkMetrics';
import SuperadminSystemHealthOverviewInfrastructure from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewInfrastructure';
import SuperadminSystemHealthOverviewIntegrations from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewIntegrations';

/**
 * Performs the superadmin system health overview dashboard sections operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewDashboardSections() {
  return (
    <>
      <SuperadminSystemHealthOverviewNetworkMetrics />
      <SuperadminSystemHealthOverviewInfrastructure />
      <SuperadminSystemHealthOverviewIntegrations />
    </>
  );
}
