// RESPONSIBILITY: Render the route loading state for settings general; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_general/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsGeneralListSkeleton from './components/SuperadminSettingsGeneralListSkeleton';

/**
 * Performs the module loading operation within settings general; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsGeneralListSkeleton />;
}
