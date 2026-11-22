/** Responsibility: isolated route adapter for the Active Sessions workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityActiveSessionsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityActiveSessionsPageClient from '@/app/frontend_superadmin/superadmin_security/security_active_sessions/components/SuperadminSecurityActiveSessionsPageClient.tsx';

/**
 * Composes the security active sessions screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityActiveSessionsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityActiveSessionsPageClient />;
}
