// RESPONSIBILITY: Render the route loading state for security ip firewall; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_ip_firewall/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityIpFirewallListSkeleton from './components/SuperadminSecurityIpFirewallListSkeleton';

/**
 * Performs the module loading operation within security ip firewall; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityIpFirewallListSkeleton />;
}
