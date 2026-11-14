/** Responsibility: isolated route adapter for the General workflow. */
/** Data-Flow: canonical route props -> SuperadminSettingsGeneralScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSettingsGeneralPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_general/components/SuperadminSettingsGeneralPageClient.tsx';

/**
 * Composes the settings general screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsGeneralScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSettingsGeneralPageClient />;
}
