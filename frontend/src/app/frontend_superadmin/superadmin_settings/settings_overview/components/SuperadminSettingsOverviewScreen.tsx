/** Responsibility: Route adapter for the settings_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSettingsOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the settings_overview autonomous module. */
import SuperadminSettingsOverviewPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_overview/components/SuperadminSettingsOverviewPageClient';

/**
 * Composes the settings overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsOverviewScreen({ id }: { id?: string }) {
  return <SuperadminSettingsOverviewPageClient />;
}
