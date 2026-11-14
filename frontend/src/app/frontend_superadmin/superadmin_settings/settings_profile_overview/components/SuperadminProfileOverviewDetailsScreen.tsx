/** Responsibility: isolated route adapter for the Profile workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileOverviewDetailsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileOverviewDetailsPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewDetailsPageClient.tsx';

/**
 * Composes the profile overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileOverviewDetailsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileOverviewDetailsPageClient />;
}
