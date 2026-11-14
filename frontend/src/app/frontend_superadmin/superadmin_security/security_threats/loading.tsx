// RESPONSIBILITY: Render the route loading state for security threats; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_threats/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityThreatsListSkeleton from './components/SuperadminSecurityThreatsListSkeleton';

/**
 * Performs the module loading operation within security threats; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityThreatsListSkeleton />;
}
