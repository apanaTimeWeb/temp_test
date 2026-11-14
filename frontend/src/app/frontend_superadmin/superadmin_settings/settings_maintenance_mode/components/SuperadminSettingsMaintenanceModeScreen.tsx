/** Responsibility: isolated route adapter for the Maintenance Mode workflow. */
/** Data-Flow: canonical route props -> SuperadminSettingsMaintenanceModeScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSettingsMaintenanceModePageClient from '@/app/frontend_superadmin/superadmin_settings/settings_maintenance_mode/components/SuperadminSettingsMaintenanceModePageClient.tsx';

/**
 * Composes the settings maintenance mode screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsMaintenanceModeScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSettingsMaintenanceModePageClient />;
}
