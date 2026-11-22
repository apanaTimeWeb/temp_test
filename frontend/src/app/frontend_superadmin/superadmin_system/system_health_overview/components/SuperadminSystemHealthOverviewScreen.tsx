/** Responsibility: Route adapter for the system_health_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSystemHealthOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the system_health_overview autonomous module. */
import SuperadminSystemHealthOverviewMain from '@/app/frontend_superadmin/superadmin_system/system_health_overview/components/SuperadminSystemHealthOverviewMain';

/**
 * Composes the system health overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSystemHealthOverviewScreen({ id }: { id?: string }) {
  return <SuperadminSystemHealthOverviewMain />;
}
