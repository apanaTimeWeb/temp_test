/** Responsibility: isolated route adapter for the API Keys workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityApiKeysScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityApiKeysPageClient from '@/app/frontend_superadmin/superadmin_security/security_api_keys/components/SuperadminSecurityApiKeysPageClient.tsx';

/**
 * Composes the security api keys screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityApiKeysScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityApiKeysPageClient />;
}
