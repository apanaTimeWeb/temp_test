/** Responsibility: isolated route adapter for the APIs & Integrations workflow. */
/** Data-Flow: canonical route props -> SuperadminSettingsIntegrationsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSettingsIntegrationsPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_integrations/components/SuperadminSettingsIntegrationsPageClient.tsx';

/**
 * Composes the settings integrations screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSettingsIntegrationsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSettingsIntegrationsPageClient />;
}
