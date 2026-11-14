/** Responsibility: isolated route adapter for the Login Security workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityLoginSecurityScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityLoginSecurityPageClient from '@/app/frontend_superadmin/superadmin_security/security_login_security/components/SuperadminSecurityLoginSecurityPageClient.tsx';

/**
 * Composes the security login security screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityLoginSecurityScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityLoginSecurityPageClient />;
}
