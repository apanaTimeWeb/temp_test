/** Responsibility: isolated route adapter for the 2FA & MFA workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityMfaScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityMfaPageClient from '@/app/frontend_superadmin/superadmin_security/security_mfa/components/SuperadminSecurityMfaPageClient.tsx';

/**
 * Composes the security mfa screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityMfaScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityMfaPageClient />;
}
