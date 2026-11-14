/** Responsibility: isolated route adapter for the Storage workflow. */
/** Data-Flow: canonical route props -> SuperadminSettingsStorageScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSettingsStoragePageClient from '@/app/frontend_superadmin/superadmin_settings/settings_storage/components/SuperadminSettingsStoragePageClient.tsx';

/**
 * Composes the settings storage screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsStorageScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSettingsStoragePageClient />;
}
