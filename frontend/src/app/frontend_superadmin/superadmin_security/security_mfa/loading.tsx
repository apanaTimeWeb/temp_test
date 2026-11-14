// RESPONSIBILITY: Render the route loading state for security mfa; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_mfa/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityMfaListSkeleton from './components/SuperadminSecurityMfaListSkeleton';

/**
 * Performs the module loading operation within security mfa; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityMfaListSkeleton />;
}
