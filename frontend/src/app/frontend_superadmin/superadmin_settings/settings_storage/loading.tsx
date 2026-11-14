// RESPONSIBILITY: Render the route loading state for settings storage; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_storage/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsStorageListSkeleton from './components/SuperadminSettingsStorageListSkeleton';

/**
 * Performs the module loading operation within settings storage; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsStorageListSkeleton />;
}
