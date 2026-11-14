/** Responsibility: isolated route adapter for the Security Settings workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileSecuritySettingsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileSecuritySettingsPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecuritySettingsPageClient.tsx';

/**
 * Composes the profile security screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileSecuritySettingsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileSecuritySettingsPageClient />;
}
