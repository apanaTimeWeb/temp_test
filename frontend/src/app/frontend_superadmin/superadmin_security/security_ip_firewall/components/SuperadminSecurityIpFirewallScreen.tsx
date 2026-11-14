/** Responsibility: isolated route adapter for the IP Firewall workflow. */
/** Data-Flow: canonical route props -> SuperadminSecurityIpFirewallScreen -> typed leaf-owned child components; sibling business modules are not required. */
import SuperadminSecurityIpFirewallPageClient from '@/app/frontend_superadmin/superadmin_security/security_ip_firewall/components/SuperadminSecurityIpFirewallPageClient.tsx';

/**
 * Composes the security ip firewall screen from its leaf-owned presentation and interaction components.
 * @param parameter Input required by the declared feature contract. Declared type: { id?: string; }.
 */
export default function SuperadminSecurityIpFirewallScreen({ id }: { id?: string }) {
  void id;
  return <SuperadminSecurityIpFirewallPageClient />;
}
