/** Responsibility: isolated route adapter for the Audit & Threats workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityThreatsScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityThreatsPageClient from '@/app/frontend_superadmin/superadmin_security/security_threats/components/SuperadminSecurityThreatsPageClient.tsx';

/**
 * Composes the security threats screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityThreatsScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityThreatsPageClient />;
}
