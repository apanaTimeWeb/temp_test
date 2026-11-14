/** Responsibility: isolated route adapter for the 2FA workflow. */
/** Data-Flow: canonical route props -> SuperadminProfileSecurityTwoFactorScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminProfileSecurityTwoFactorPageClient from '@/app/frontend_superadmin/superadmin_settings/settings_profile_security/components/SuperadminProfileSecurityTwoFactorPageClient.tsx';

/**
 * Composes the profile security screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminProfileSecurityTwoFactorScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminProfileSecurityTwoFactorPageClient />;
}
