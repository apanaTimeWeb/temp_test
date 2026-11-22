// RESPONSIBILITY: Render the route error boundary for security ip firewall; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_security/security_ip_firewall/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminSecurityIpFirewallErrorFallback from './components/SuperadminSecurityIpFirewallErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within security ip firewall; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminSecurityIpFirewallErrorFallback error={error} reset={reset} />;
}
