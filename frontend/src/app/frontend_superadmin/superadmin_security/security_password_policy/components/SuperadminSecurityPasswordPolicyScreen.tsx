/** Responsibility: isolated route adapter for the Password Policy workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityPasswordPolicyScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityPasswordPolicyPageClient from '@/app/frontend_superadmin/superadmin_security/security_password_policy/components/SuperadminSecurityPasswordPolicyPageClient.tsx';

/**
 * Composes the security password policy screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityPasswordPolicyScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityPasswordPolicyPageClient />;
}
