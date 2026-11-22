/** Responsibility: Route adapter for the security_overview screen; delegates rendering to the module-owned page client. */
/** Data-Flow: canonical route props -> SuperadminSecurityOverviewScreen -> typed leaf-owned child components; sibling business modules are not required. */
/** Thin route adapter for `overview` inside the security_overview autonomous module. */
import SuperadminSecurityOverviewPageClient from '@/app/frontend_superadmin/superadmin_security/security_overview/components/SuperadminSecurityOverviewPageClient';

/**
 * Composes the security overview screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityOverviewScreen({ id }: { id?: string }) {
  return <SuperadminSecurityOverviewPageClient />;
}
