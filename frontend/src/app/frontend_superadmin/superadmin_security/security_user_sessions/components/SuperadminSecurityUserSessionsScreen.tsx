/** Responsibility: isolated route adapter for the User Sessions workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityUserSessionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityUserSessionsPageClient from '@/app/frontend_superadmin/superadmin_security/security_user_sessions/components/SuperadminSecurityUserSessionsPageClient.tsx';

/**
 * Composes the security user sessions screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityUserSessionsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityUserSessionsPageClient />;
}
