/** Responsibility: isolated route adapter for the Appearance workflow. */
/** Data-Flow: canonical route props -> SuperadminSettingsAppearanceScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSettingsAppearancePageClient from '@/app/frontend_superadmin/superadmin_settings/settings_appearance/components/SuperadminSettingsAppearancePageClient.tsx';

/**
 * Composes the settings appearance screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsAppearanceScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSettingsAppearancePageClient />;
}
