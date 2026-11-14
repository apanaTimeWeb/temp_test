/** Responsibility: isolated route adapter for the Change Password workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileSecurityChangePasswordScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileSecurityChangePasswordPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecurityChangePasswordPageClient.tsx';

/**
 * Composes the profile security screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileSecurityChangePasswordScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileSecurityChangePasswordPageClient />;
}
