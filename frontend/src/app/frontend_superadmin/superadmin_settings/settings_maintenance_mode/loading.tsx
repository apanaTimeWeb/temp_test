// RESPONSIBILITY: Render the route loading state for settings maintenance mode; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_maintenance_mode/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsMaintenanceModeListSkeleton from './components/SuperadminSettingsMaintenanceModeListSkeleton';

/**
 * Performs the module loading operation within settings maintenance mode; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsMaintenanceModeListSkeleton />;
}
