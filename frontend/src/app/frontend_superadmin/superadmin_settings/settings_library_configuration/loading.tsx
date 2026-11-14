// RESPONSIBILITY: Render the route loading state for settings library configuration; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_library_configuration/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the module-local route skeleton. */
import SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton from './components/SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton';

export default function ModuleLoading() {
  return <SuperadminSettingsGeneralSettingsLibraryConfigurationRouteSkeleton />;
}
