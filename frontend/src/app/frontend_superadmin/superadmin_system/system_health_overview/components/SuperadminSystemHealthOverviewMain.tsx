/** Responsibility: Superadmin System Health Main; keep this view focused on its named module UI responsibility and delegate domain/state logic to module-owned hooks. */
/** Data-Flow: leaf-owned props or hook state -> SuperadminSystemHealthOverviewMain formatting/filtering -> accessible feature presentation; persistence stays at the leaf API boundary. */
import SuperadminSystemHealthOverviewHeaderStatus from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewHeaderStatus';
import SuperadminSystemHealthOverviewDashboardSections from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewDashboardSections';

/**
 * Performs the superadmin system health overview main operation within system health overview; inputs and outputs follow the declared TypeScript contract.
 */
export default function SuperadminSystemHealthOverviewMain() {
  return (
    <div className="sa-page-animate pb-12">
      <SuperadminSystemHealthOverviewHeaderStatus />
      <SuperadminSystemHealthOverviewDashboardSections />
    </div>
  );
}
