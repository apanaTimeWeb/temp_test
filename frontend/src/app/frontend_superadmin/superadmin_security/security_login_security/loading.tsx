// RESPONSIBILITY: Render the route loading state for security login security; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_login_security/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityLoginSecurityListSkeleton from './components/SuperadminSecurityLoginSecurityListSkeleton';

/**
 * Performs the module loading operation within security login security; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityLoginSecurityListSkeleton />;
}
