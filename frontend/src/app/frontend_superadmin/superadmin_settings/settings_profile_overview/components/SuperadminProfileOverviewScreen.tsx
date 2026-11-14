/** Responsibility: Route adapter for the profile_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminProfileOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the profile_overview autonomous module. */
import SuperadminProfileOverviewPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewPageClient';

/**
 * Composes the profile overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileOverviewScreen({ id }: { id?: string }) {
  return <SuperadminProfileOverviewPageClient />;
}
