/** Responsibility: Route adapter for the dashboard_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminDashboardOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the dashboard_overview autonomous module. */
import SuperadminDashboardOverviewMain from '@/app/frontend_superadmin/superadmin_dashboard/dashboard_overview/components/SuperadminDashboardOverviewMain';

/**
 * Composes the dashboard overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminDashboardOverviewScreen({ id }: { id?: string }) {
  return <SuperadminDashboardOverviewMain />;
}
