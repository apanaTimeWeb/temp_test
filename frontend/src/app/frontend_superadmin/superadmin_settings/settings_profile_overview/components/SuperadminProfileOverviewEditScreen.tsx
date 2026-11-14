/** Responsibility: isolated route adapter for the Edit Profile workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileOverviewEditScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileOverviewEditPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_overview/components/SuperadminProfileOverviewEditPageClient.tsx';

/**
 * Composes the profile overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileOverviewEditScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileOverviewEditPageClient />;
}
