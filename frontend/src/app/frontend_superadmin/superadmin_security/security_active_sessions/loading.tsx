// RESPONSIBILITY: Render the route loading state for security active sessions; it does not fetch or mutate business data.
// FLOW: App Router pending state -> superadmin_security/security_active_sessions/loading.tsx -> loading UI -> route content when ready.
/** Framework loading boundary delegates to the feature-local skeleton component. */
import SuperadminSecurityActiveSessionsListSkeleton from './components/SuperadminSecurityActiveSessionsListSkeleton';

/**
 * Performs the module loading operation within security active sessions; inputs and outputs follow the declared TypeScript contract.
 */
export default function ModuleLoading() {
  return <SuperadminSecurityActiveSessionsListSkeleton />;
}
