// RESPONSIBILITY: Render the route error boundary for security api keys; it does not suppress or invent a successful result.
// FLOW: App Router error boundary -> superadmin_security/security_api_keys/error.tsx -> localized recovery UI -> retry/reset action.
/** Framework error boundary delegates to the feature-local retry component with explicit props. */
'use client';

import SuperadminSecurityApiKeysErrorFallback from './components/SuperadminSecurityApiKeysErrorFallback';

type ModuleErrorProps = { error: Error & { digest?: string }; reset: () => void };

/**
 * Performs the module error operation within security api keys; inputs and outputs follow the declared TypeScript contract.
 * @param parameter Input required by the declared feature contract. Declared type: ModuleErrorProps.
 */
export default function ModuleError({ error, reset }: ModuleErrorProps) {
  return <SuperadminSecurityApiKeysErrorFallback error={error} reset={reset} />;
}
