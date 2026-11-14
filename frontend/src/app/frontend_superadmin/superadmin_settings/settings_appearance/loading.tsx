// RESPONSIBILITY: Render the route loading state for settings appearance; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_settings/settings_appearance/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSettingsAppearanceListSkeleton from './components/SuperadminSettingsAppearanceListSkeleton';

/**
 * Performs the module loading operation within settings appearance; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSettingsAppearanceListSkeleton />;
}
