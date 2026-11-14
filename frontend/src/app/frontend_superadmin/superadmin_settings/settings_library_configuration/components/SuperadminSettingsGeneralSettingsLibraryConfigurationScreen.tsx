/** Responsibility: Route adapter for the settings_library_configuration screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSettingsGeneralSettingsLibraryConfigurationScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `settings` inside the settings_library_configuration autonomous module. */
import SuperadminSystemSettingsPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_library_configuration/components/SuperadminSettingsGeneralSettingsLibraryConfigurationPageClient';

/**
 * Composes the settings general screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsGeneralSettingsLibraryConfigurationScreen({ id }: { id?: string }) {
  return <SuperadminSystemSettingsPageClient />;
}
