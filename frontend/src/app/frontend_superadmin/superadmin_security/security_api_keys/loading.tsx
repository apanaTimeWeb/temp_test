// RESPONSIBILITY: Render the route loading state for security api keys; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_api_keys/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityApiKeysListSkeleton from './components/SuperadminSecurityApiKeysListSkeleton';

/**
 * Performs the module loading operation within security api keys; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityApiKeysListSkeleton />;
}
